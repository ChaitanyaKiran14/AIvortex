import httpx
import os
import json
from app.models import Node

async def execute(node: Node) -> str:
    gemini_api_key = os.environ.get("GEMINI_FLASH_THINKING_KEY")
    deepseek_api_key = os.environ.get("DEEPSEEK_API_KEY")

    if not gemini_api_key or not deepseek_api_key:
        raise ValueError("API keys for AI models are missing")

    prompt = node.data.prompt or ""
    context = node.data.context or ""

    previous_results = getattr(node.data, '_previous_results', [])
    combined_input = ""

    if previous_results:
        for result in previous_results:
            try:
                data = json.loads(result)
                if isinstance(data, dict):
                    combined_input += json.dumps(data, indent=2) + "\n\n"
                else:
                    combined_input += result + "\n\n"
            except (json.JSONDecodeError, ValueError, TypeError):
                combined_input += result + "\n\n"

    final_prompt = f"{context}\n{combined_input}\n{prompt}"
    model = node.data.model or "gemini-2.0-flash-thinking-exp-01-21"

    if model.startswith("gemini"):
        return await call_gemini_api(final_prompt, gemini_api_key)
    elif model == "deepseek-r1":
        return await call_deepseek_api(final_prompt, deepseek_api_key)
    else:
        return "Invalid model selected."

async def call_gemini_api(prompt: str, api_key: str) -> str:
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://app.aievaluate.xyz",
        "X-Title": "AIVortex",
    }
    
    payload = {
        "model": "google/gemini-2.0-flash-thinking-exp:free",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response_data = response.json()

            if 'error' in response_data:
                return f"API Error: {response_data['error'].get('message', 'Unknown error')}"

            try:
                return response_data["choices"][0]["message"]["content"]
            except (KeyError, IndexError):
                return "Error processing Gemini response."
    
    except Exception as e:
        return f"Unexpected error with Gemini API: {str(e)}"

async def call_deepseek_api(prompt: str, api_key: str) -> str:
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://app.aievaluate.xyz",
        "X-Title": "AIVortex",
    }
    
    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response_data = response.json()

            if 'error' in response_data:
                return f"API Error: {response_data['error'].get('message', 'Unknown error')}"

            try:
                return response_data["choices"][0]["message"]["content"]
            except (KeyError, IndexError):
                return "Error processing Deepseek response."
    
    except Exception as e:
        return f"Unexpected error with Deepseek API: {str(e)}"