# C:\AdvanceLearnings\AIvortex\Backend\app\main.py
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

# Load environment variables from .env file
load_dotenv()

# Import all handlers for the various node types
from app.handlers import askai, pdf_generator, linkedin, typeform, combine_text

app = FastAPI(debug=True)
app.mount("/generated_pdfs", StaticFiles(directory="generated_pdfs"), name="generated_pdfs")

# Define allowed origins – update this list if needed
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",  # Add any other origins you need
]

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mapping of node types to their handler functions
NODE_HANDLERS = {
    "askAI": askai.execute,
    "pdfGenerator": pdf_generator.execute,
    "linkedIn": linkedin.execute,
    "typeform": typeform.execute,
    "combineText": combine_text.execute,
}

# Debug: Log the NODE_HANDLERS keys to confirm combineText is present
print("NODE_HANDLERS keys:", list(NODE_HANDLERS.keys()))

# Recursive function to execute a node and its children (DFS logic)
async def execute_node_and_children(
    node_id: str,
    nodes_map: dict,
    edges: list,
    executed: set,
    outputs: dict,
    executing: set = None,
    scheduled: set = None,
    execute_children: bool = True,  # Control whether to execute child nodes
):
    if executing is None:
        executing = set()
    if scheduled is None:
        scheduled = set()
    
    # Return if already executed
    if node_id in executed:
        print(f"Node {node_id} already executed, returning result: {outputs[node_id]}")
        return outputs[node_id]
    
    # Check for circular dependencies and already executing nodes
    if node_id in executing:
        raise HTTPException(status_code=400, detail=f"Circular dependency detected for node: {node_id}")
    
    # Mark as currently executing
    executing.add(node_id)
    
    node: Node = nodes_map[node_id]
    
    # Debug: Log the node being executed
    print(f"Starting execution of node: {node_id}, Type: {node.type}")
    
    # Get the appropriate handler for the node type
    handler = NODE_HANDLERS.get(node.type)
    if not handler:
        executing.remove(node_id)
        raise HTTPException(status_code=400, detail=f"No handler for node type: {node.type}")
    
    # Find all parent nodes that need to be executed first
    parent_nodes = []
    for edge in edges:
        if edge.target == node_id:
            parent_nodes.append(edge.source)
    
    # Debug: Log parent nodes
    print(f"Parent nodes for {node_id}: {parent_nodes}")
    
    # Execute all parent nodes concurrently and wait for them to complete
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
    
    # Get incoming node results from all parent nodes
    incoming_results = []
    for edge in edges:
        if edge.target == node_id:
            if edge.source in outputs:
                incoming_results.append(outputs[edge.source])
            else:
                print(f"Warning: Parent node {edge.source} for node {node_id} has not completed execution or result is missing in outputs")
    
    # Debug: Log the incoming results
    print(f"Incoming results for node {node_id}: {incoming_results}")
    
    # Store incoming results in node data for the handler to use
    setattr(node.data, '_previous_results', incoming_results)
    
    # Execute the node and store the result
    print(f"Executing handler for node {node_id}")
    result = await handler(node)
    outputs[node_id] = result
    executed.add(node_id)
    
    # Debug: Log the result
    print(f"Node {node_id} executed, result: {result}")
    
    # Remove from currently executing set
    executing.remove(node_id)
    
    # Process child nodes only if execute_children is True
    if not execute_children:
        print(f"Skipping child execution for node {node_id}")
        return result
    
    children_ids = get_outgoers(node_id, edges)
    
    # Debug: Log child nodes
    print(f"Child nodes for {node_id}: {children_ids}")
    
    # Schedule child nodes
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
        # Debug: Log all node types in the workflow
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

        # Step 1: Execute all start nodes without scheduling their children
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

        # Step 2: Collect all child nodes of start nodes
        start_node_children = set()
        for node in start_nodes:
            children_ids = get_outgoers(node.id, workflow.edges)
            start_node_children.update(children_ids)

        # Step 3: Execute all child nodes of start nodes
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

# Test endpoint to verify that environment variables are loaded correctly
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