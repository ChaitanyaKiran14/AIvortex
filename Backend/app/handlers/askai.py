# app/handlers/askai.py
import httpx
from app.models import Node
import os

async def execute(node: Node) -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyCBCm25dj-37vEbO30XhjgWUfZM_2q2WR8")
    
    model = node.data.model or "gemini-pro"
    prompt = node.data.prompt or ""
    context = node.data.context or ""
    

   
    if "haiku" in model.lower():
        gemini_model = "gemini-pro"
    elif "sonnet" in model.lower() or "opus" in model.lower():
        gemini_model = "gemini-pro" 
    else:
        gemini_model = "gemini-pro"
    
    payload = {
        "contents": [
            {"parts": [{"text": f"{context} {prompt}"}]}
        ]
    }
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={api_key}"
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
    
    # Extract text from Google AI API response format
    try:
        response_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return response_text
    except (KeyError, IndexError) as e:
        return f"Error processing response: {str(e)}"