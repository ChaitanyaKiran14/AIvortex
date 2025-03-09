# app/handlers/askai.py
import httpx
import os
import json
from app.models import Node

async def execute(node: Node) -> str:
    # Retrieve API key from environment variable
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    
    prompt = node.data.prompt or ""
    context = node.data.context or ""
    
    # Get incoming data from previous nodes
    previous_results = getattr(node.data, '_previous_results', [])
    combined_input = ""
    
    if previous_results:
        for result in previous_results:
            try:
                # Try to parse the result as JSON
                data = json.loads(result)
                if isinstance(data, dict):
                    # Format JSON data for use in the prompt
                    combined_input += json.dumps(data, indent=2) + "\n\n"
                else:
                    combined_input += result + "\n\n"
            except (json.JSONDecodeError, ValueError, TypeError):
                # Not JSON, use as plain text
                combined_input += result + "\n\n"
    
    # Combine all inputs with the prompt and context
    final_prompt = f"{context}\n{combined_input}\n{prompt}"
    
    # Use the most recent model name
    model = "gemini-1.5-pro-latest"
    
    payload = {
        "contents": [
            {"parts": [{"text": final_prompt}]}
        ]
    }
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            response_data = response.json()
            
            # Check for errors in the response
            if 'error' in response_data:
                return f"API Error: {response_data['error'].get('message', 'Unknown error')}"
            
            # Extract text from response
            try:
                response_text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                return response_text
            except (KeyError, IndexError) as e:
                return f"Error processing response: {str(e)}"
    
    except httpx.HTTPStatusError as e:
        return f"HTTP Error: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"