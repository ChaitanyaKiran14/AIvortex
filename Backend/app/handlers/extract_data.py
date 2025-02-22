# app/handlers/extract_data.py
import httpx
from app.models import Node

async def execute(node: Node) -> str:
    payload = node.data  # Assume node.data contains the necessary extraction parameters
    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:11434/api/generate", json=payload)
        response.raise_for_status()
        data = response.json()
    return data.get("result", "")
