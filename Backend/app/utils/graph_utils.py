from typing import List
from app.models import Node, Edge

def get_start_nodes(nodes: List[Node], edges: List[Edge]) -> List[Node]:
    """Return nodes that are not targets of any edge."""
    target_ids = {edge.target for edge in edges}
    return [node for node in nodes if node.id not in target_ids]

def get_outgoers(node_id: str, edges: List[Edge]) -> List[str]:
    """Return the list of node IDs that are children of the given node_id."""
    return [edge.target for edge in edges if edge.source == node_id] 

