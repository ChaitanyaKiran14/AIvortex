import httpx
import json
from app.models import Node

async def execute(node: Node) -> str:
    # Extract formId and apiKey from the node's data
    form_id = getattr(node.data, "formId", None)
    api_key = getattr(node.data, "apiKey", None)
    if not form_id or not api_key:
        return "Error: Form ID or API Key not provided in node data."
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json"
    }
    
    # Construct URLs for responses and form definition
    responses_url = f"https://api.typeform.com/forms/{form_id}/responses?sort=submitted_at,desc"
    form_url = f"https://api.typeform.com/forms/{form_id}"
    
    try:
        async with httpx.AsyncClient() as client:
            # Fetch responses
            responses_resp = await client.get(responses_url, headers=headers)
            responses_resp.raise_for_status()
            responses_data = responses_resp.json()
            
            if not responses_data.get("items"):
                return "No responses found."
            
            # Get the most recent response
            latest_response = responses_data["items"][0]
            
            # Fetch form definition to map field IDs to question titles
            form_resp = await client.get(form_url, headers=headers)
            form_resp.raise_for_status()
            form_data = form_resp.json()
        
        # Build a dictionary mapping field id to its question title
        field_mapping = {}
        for field in form_data.get("fields", []):
            field_id = field.get("id")
            question = field.get("title", "Unknown Question")
            field_mapping[field_id] = question
        
        # Prepare a dictionary for question/answer pairs from the latest response
        result = {}
        for answer in latest_response.get("answers", []):
            # Get the field id for the answer
            field_id = answer["field"]["id"]
            # Lookup the question text from the form definition
            question_text = field_mapping.get(field_id, field_id)
            
            # Determine the answer value based on the answer type
            answer_type = answer.get("type")
            if answer_type == "number":
                response_value = answer.get("number")
            elif answer_type == "choice":
                response_value = answer.get("choice", {}).get("label")
            elif answer_type == "text":
                response_value = answer.get("text")
            else:
                # For any other type, fallback to a generic extraction if available
                response_value = answer.get(answer_type)
            
            result[question_text] = response_value
        
        output = {
            "submitted_at": latest_response.get("submitted_at"),
            "answers": result
        }
        return json.dumps(output, indent=2)
    
    except Exception as e:
        return f"Error fetching Typeform responses: {str(e)}"
