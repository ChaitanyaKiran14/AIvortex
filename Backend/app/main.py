import uvicorn
import os
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Workflow, Node, Edge
from app.utils.graph_utils import get_start_nodes, get_outgoers
from dotenv import load_dotenv
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

load_dotenv()

from app.handlers import askai, pdf_generator, linkedin, typeform, combine_text, culture_fit

app = FastAPI(debug=True)
app.mount("/generated_pdfs", StaticFiles(directory="generated_pdfs"), name="generated_pdfs")


origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NODE_HANDLERS = {
    "askAI": askai.execute,
    "pdfGenerator": pdf_generator.execute,
    "linkedIn": linkedin.execute,
    "typeform": typeform.execute,
    "combineText": combine_text.execute,
    "cultureFit": culture_fit.execute,  
}


print("NODE_HANDLERS keys:", list(NODE_HANDLERS.keys()))

async def execute_node_and_children(
    node_id: str,
    nodes_map: dict,
    edges: list,
    executed: set,
    outputs: dict,
    executing: set = None,
    scheduled: set = None,
    execute_children: bool = True,
):
    if executing is None:
        executing = set()
    if scheduled is None:
        scheduled = set()
    
    if node_id in executed:
        print(f"Node {node_id} already executed, returning result: {outputs[node_id]}")
        return outputs[node_id]
    
    if node_id in executing:
        raise HTTPException(status_code=400, detail=f"Circular dependency detected for node: {node_id}")
    
    executing.add(node_id)
    
    node: Node = nodes_map[node_id]
    
    print(f"Starting execution of node: {node_id}, Type: {node.type}")
    
    handler = NODE_HANDLERS.get(node.type)
    if not handler:
        executing.remove(node_id)
        raise HTTPException(status_code=400, detail=f"No handler for node type: {node.type}")
    
    parent_nodes = []
    for edge in edges:
        if edge.target == node_id:
            parent_nodes.append(edge.source)
    
    print(f"Parent nodes for {node_id}: {parent_nodes}")
    
    if parent_nodes:
        parent_tasks = []
        for parent_id in parent_nodes:
            if parent_id not in executed and parent_id not in scheduled:
                print(f"Scheduling execution of parent node: {parent_id}")
                scheduled.add(parent_id)
                task = asyncio.create_task(
                    execute_node_and_children(parent_id, nodes_map, edges, executed, outputs, executing, scheduled)
                )
                parent_tasks.append(task)
        
        if parent_tasks:
            print(f"Waiting for {len(parent_tasks)} parent tasks to complete for node {node_id}")
            await asyncio.gather(*parent_tasks)
            print(f"All parent tasks for node {node_id} completed")
    
    if node.type == "askAI":
        culture_fit_parent = None
        for parent_id in parent_nodes:
            parent_node = nodes_map[parent_id]
            if parent_node.type == "cultureFit" and parent_id in outputs:
                culture_fit_parent = parent_id
                break
        
        if culture_fit_parent:
            print(f"Found CultureFitNode parent {culture_fit_parent} for AskAINode {node_id}")
            node.data.context = outputs[culture_fit_parent]
            print(f"Set context for AskAINode {node_id} to: {node.data.context}")
        else:
            print(f"No CultureFitNode parent found for AskAINode {node_id}, using existing context: {node.data.context}")
    
    incoming_results = []
    for edge in edges:
        if edge.target == node_id:
            source_node = nodes_map[edge.source]
            if node.type == "askAI" and source_node.type == "cultureFit":
                continue
            if edge.source in outputs:
                incoming_results.append(outputs[edge.source])
            else:
                print(f"Warning: Parent node {edge.source} for node {node_id} has not completed execution or result is missing in outputs")
    
    print(f"Incoming results for node {node_id}: {incoming_results}")
    
    setattr(node.data, '_previous_results', incoming_results)
    
    print(f"Executing handler for node {node_id}")
    result = await handler(node)
    outputs[node_id] = result
    executed.add(node_id)
    
    print(f"Node {node_id} executed, result: {result}")
    
    executing.remove(node_id)
    
    if not execute_children:
        print(f"Skipping child execution for node {node_id}")
        return result
    
    children_ids = get_outgoers(node_id, edges)
    
    print(f"Child nodes for {node_id}: {children_ids}")
    
    child_tasks = []
    for child_id in children_ids:
        if child_id not in executed and child_id not in scheduled:
            print(f"Scheduling execution of child node: {child_id}")
            scheduled.add(child_id)
            task = asyncio.create_task(
                execute_node_and_children(child_id, nodes_map, edges, executed, outputs, executing, scheduled)
            )
            child_tasks.append(task)
    
    if child_tasks:
        print(f"Waiting for {len(child_tasks)} child tasks to complete for node {node_id}")
        await asyncio.gather(*child_tasks)
        print(f"All child tasks for node {node_id} completed")
    
    return result

@app.post("/execute-workflow")
async def execute_workflow(workflow: Workflow):
    try:
        print("Nodes in workflow:")
        for node in workflow.nodes:
            print(f"Node ID: {node.id}, Type: {node.type}")

        nodes_map = {node.id: node for node in workflow.nodes}
        start_nodes = get_start_nodes(workflow.nodes, workflow.edges)
        if not start_nodes:
            raise HTTPException(status_code=400, detail="No start nodes found in the workflow.")

        outputs = {}
        executed = set()
        scheduled = set()

        start_tasks = []
        for node in start_nodes:
            if node.id not in scheduled:
                print(f"Scheduling execution of start node: {node.id}")
                scheduled.add(node.id)
                task = asyncio.create_task(
                    execute_node_and_children(node.id, nodes_map, workflow.edges, executed, outputs, scheduled=scheduled, execute_children=False)
                )
                start_tasks.append(task)
        
        print(f"Waiting for {len(start_tasks)} start tasks to complete")
        await asyncio.gather(*start_tasks)
        print("All start tasks completed")

        start_node_children = set()
        for node in start_nodes:
            children_ids = get_outgoers(node.id, workflow.edges)
            start_node_children.update(children_ids)

        child_tasks = []
        for child_id in start_node_children:
            if child_id not in executed and child_id not in scheduled:
                print(f"Scheduling execution of child node of start node: {child_id}")
                scheduled.add(child_id)
                task = asyncio.create_task(
                    execute_node_and_children(child_id, nodes_map, workflow.edges, executed, outputs, scheduled=scheduled)
                )
                child_tasks.append(task)
        
        if child_tasks:
            print(f"Waiting for {len(child_tasks)} child tasks to complete")
            await asyncio.gather(*child_tasks)
            print("All child tasks of start nodes completed")

        return {"results": outputs}

    except Exception as e:
        import traceback
        print("Error in workflow execution:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test-env")
async def test_env():
    api_key = os.environ.get("GEMINI_API_KEY", "Not found")
    li_at = os.environ.get("LI_AT", "Not found")
    return {
        "gemini_key_prefix": api_key[:5] + "..." if len(api_key) > 5 else "Not found",
        "li_at_prefix": li_at[:5] + "..." if len(li_at) > 5 else "Not found"
    }

@app.get("/download-pdf/{filename}")
async def download_pdf(filename: str):
    file_path = os.path.join("generated_pdfs", filename)
    if os.path.exists(file_path):
        return FileResponse(
            file_path,
            media_type="application/pdf",
            filename=filename
        )
    raise HTTPException(status_code=404, detail="PDF not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)