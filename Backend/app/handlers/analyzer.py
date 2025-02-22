# app/handlers/analyzer.py
import httpx
from app.models import Node

async def execute(node: Node) -> str:
    text = node.data.get("text", "")
    payload = {
        "model": "llama3",
        "prompt": f"Analyze this text and provide key insights:\n\n{text}"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:11434/api/generate", json=payload)
        response.raise_for_status()
        data = response.json()
    return data.get("response", "")
