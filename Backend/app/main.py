import uvicorn
import os
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
from app.handlers import askai, pdf_generator, linkedin

app = FastAPI(debug=True)
app.mount("/generated_pdfs", StaticFiles(directory="generated_pdfs"), name="generated_pdfs")

# Define allowed origins – update this list if needed
origins = [
    "http://localhost:5173",
    "http://localhost:5174"
    "http://localhost:3000",  # Add any other origins you need
]

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only our frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mapping of node types to their handler functions
NODE_HANDLERS = {
    "askAI": askai.execute,
    "pdfGenerator": pdf_generator.execute,
    "linkedIn": linkedin.execute,  # Add LinkedIn handler
}

# Recursive function to execute a node and its children (DFS logic)
async def execute_node_and_children(
    node_id: str,
    nodes_map: dict,
    edges: list,
    executed: set,
    outputs: dict,
):
    if node_id in executed:
        return outputs[node_id]
    
    node: Node = nodes_map[node_id]
    
    # Get the appropriate handler for the node type
    handler = NODE_HANDLERS.get(node.type)
    if not handler:
        raise HTTPException(status_code=400, detail=f"No handler for node type: {node.type}")
    
    # Get incoming node results if this node has parents
    incoming_results = []
    for edge in edges:
        if edge.target == node_id and edge.source in outputs:
            incoming_results.append(outputs[edge.source])
    
    # Store incoming results in node data for the handler to use
    # Use setattr to add _previous_results to the Pydantic model
    setattr(node.data, '_previous_results', incoming_results)
    
    # Execute the node and store the result
    result = await handler(node)
    outputs[node_id] = result
    executed.add(node_id)
    
    # Process child nodes
    children_ids = get_outgoers(node_id, edges)
    for child_id in children_ids:
        if child_id not in executed:
            await execute_node_and_children(child_id, nodes_map, edges, executed, outputs)
    
    return result


@app.post("/execute-workflow")
async def execute_workflow(workflow: Workflow):
    try:
        nodes_map = {node.id: node for node in workflow.nodes}
        start_nodes = get_start_nodes(workflow.nodes, workflow.edges)
        if not start_nodes:
            raise HTTPException(status_code=400, detail="No start nodes found in the workflow.")

        outputs = {}
        executed = set()

        for node in start_nodes:
            await execute_node_and_children(node.id, nodes_map, workflow.edges, executed, outputs)

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
    # Return only the first few characters for security
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