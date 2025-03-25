import json
from app.models import Node

async def execute(node: Node) -> str:
    try:
        # Get data from previous nodes
        previous_results = getattr(node.data, '_previous_results', [])
        if not previous_results:
            return "No input data provided to CombineTextNode."

        # Combine all previous results into a single string
        combined_output = ""
        for i, result in enumerate(previous_results):
            try:
                # Try to parse as JSON
                data = json.loads(result)
                if isinstance(data, dict):
                    combined_output += f"--- Source {i+1} ---\n"
                    combined_output += json.dumps(data, indent=2) + "\n\n"
                else:
                    combined_output += f"--- Source {i+1} ---\n"
                    combined_output += result + "\n\n"
            except (json.JSONDecodeError, ValueError, TypeError):
                # If not valid JSON, treat as plain text
                combined_output += f"--- Source {i+1} ---\n"
                combined_output += result + "\n\n"

        return combined_output

    except Exception as e:
        return f"Error combining text: {str(e)}"