from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from fastapi.encoders import jsonable_encoder

class NodeData(BaseModel):
    label: Optional[str] = None
    prompt: Optional[str] = None
    context: Optional[str] = None
    model: Optional[str] = None
    content: Optional[str] = None
    source: Optional[str] = None
    category: Optional[str] = None
    input: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True
        extra = "allow"  
        

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: NodeData

class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Workflow(BaseModel):
    nodes: List[Node]
    edges: List[Edge]