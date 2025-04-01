import httpx
import json
from app.models import Node

async def execute(node: Node) -> str:
    
    form_id = getattr(node.data, "formId", None)
    api_key = getattr(node.data, "apiKey", None)
    if not form_id or not api_key:
        return "Error: Form ID or API Key not provided in node data."
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json"
    }
    
    responses_url = f"https://api.typeform.com/forms/{form_id}/responses?sort=submitted_at,desc"
    form_url = f"https://api.typeform.com/forms/{form_id}"
    
    try:
        async with httpx.AsyncClient() as client:
           
            responses_resp = await client.get(responses_url, headers=headers)
            responses_resp.raise_for_status()
            responses_data = responses_resp.json()
            
            if not responses_data.get("items"):
                return "No responses found."
            
            latest_response = responses_data["items"][0]
            
            form_resp = await client.get(form_url, headers=headers)
            form_resp.raise_for_status()
            form_data = form_resp.json()
        
        field_mapping = {}
        for field in form_data.get("fields", []):
            field_id = field.get("id")
            question = field.get("title", "Unknown Question")
            field_mapping[field_id] = question
        
        result = {}
        for answer in latest_response.get("answers", []):
            field_id = answer["field"]["id"]
            question_text = field_mapping.get(field_id, field_id)
    
            answer_type = answer.get("type")
            if answer_type == "number":
                response_value = answer.get("number")
            elif answer_type == "choice":
                response_value = answer.get("choice", {}).get("label")
            elif answer_type == "text":
                response_value = answer.get("text")
            else:
                response_value = answer.get(answer_type)
            
            result[question_text] = response_value
        
        output = {
            "submitted_at": latest_response.get("submitted_at"),
            "answers": result
        }
        return json.dumps(output, indent=2)
    
    except Exception as e:
        return f"Error fetching Typeform responses: {str(e)}"
