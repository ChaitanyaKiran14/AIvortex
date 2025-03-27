import json
import logging
from app.models import Node

# Configure logging
logging.basicConfig(level=logging.INFO)

async def execute(node: Node) -> str:
    try:
        # Get company values and weights from node data
        company_values: str = getattr(node.data, "companyValues", "")
        weights: dict = getattr(node.data, "weights", {
            "resourcefulness": 5,
            "optimism": 4,
            "excitement": 4,
            "reliability": 3,
            "teamwork": 3
        })

        # Validate inputs
        if not company_values.strip():
            logging.error("CultureFitNode: Company values cannot be empty.")
            return "Error: Company values cannot be empty."

        if not weights or not isinstance(weights, dict):
            logging.error("CultureFitNode: Weights must be a non-empty dictionary.")
            return "Error: Weights must be a non-empty dictionary."

        for key, value in weights.items():
            if not isinstance(value, (int, float)) or value < 1 or value > 10:
                logging.error(f"CultureFitNode: Invalid weight for {key}: {value}. Must be between 1 and 10.")
                return f"Error: Invalid weight for {key}: {value}. Must be between 1 and 10."

        # Format the culture fit data as a string
        weights_string = ", ".join([f"{key}: {value}" for key, value in weights.items()])
        culture_fit_data = f"Company Values: {company_values}\nWeights: {weights_string}"

        logging.info(f"CultureFitNode Output: {culture_fit_data}")
        return culture_fit_data

    except Exception as e:
        logging.error(f"Error in CultureFitNode: {str(e)}")
        return f"Error in CultureFitNode: {str(e)}"