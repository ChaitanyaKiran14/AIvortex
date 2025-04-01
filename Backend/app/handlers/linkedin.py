import httpx
import json
import logging
import os
from app.models import Node

logging.basicConfig(level=logging.INFO)

RELEVANCE_API_URL = "https://api-d7b62b.stack.tryrelevance.com/latest/studios/edd7c776-9aa7-4b10-af36-179eb4b4a072/trigger_webhook?project=b2e1828d4693-471f-bec4-29364bc6e8ea"
RELEVANCE_API_TOKEN = os.environ.get("RELEVANCE_API_TOKEN")
RELEVANCE_PROJECT_ID = os.environ.get("RELEVANCE_PROJECT_ID")

if not RELEVANCE_API_TOKEN:
    raise ValueError("RELEVANCE_API_TOKEN environment variable is not set.")
if not RELEVANCE_PROJECT_ID:
    raise ValueError("RELEVANCE_PROJECT_ID environment variable is not set.")

SECTIONS_TO_EXTRACT = [
    "about",
    "city",
    "company",
    "current_company_join_month",
    "current_company_join_year",
    "current_job_duration",
    "educations",
    "email",
    "experiences",
    "full_name",
    "headline",
    "location",
    "job_title",
    "languages",
    "school"
]

async def execute(node: Node) -> str:
    """Execute LinkedIn profile scraping using Relevance AI API."""
    try:
        profile_url = getattr(node.data, "profileUrl", None)
        if not profile_url:
            logging.error("LinkedInNode: No LinkedIn profile URL provided.")
            return "Error: No LinkedIn profile URL provided."

        if not profile_url.startswith("https://www.linkedin.com/in/"):
            logging.error(f"LinkedInNode: Invalid LinkedIn profile URL: {profile_url}")
            return "Error: Invalid LinkedIn profile URL. URL should start with 'https://www.linkedin.com/in/'"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"{RELEVANCE_PROJECT_ID}:{RELEVANCE_API_TOKEN}"
        }
        payload = {
            "url": profile_url
        }

        logging.info(f"Calling Relevance AI API for LinkedIn profile: {profile_url}")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                RELEVANCE_API_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            response_data = response.json()

        if not response_data or "error" in response_data:
            error_message = response_data.get("error", "Unknown error from Relevance AI API")
            logging.error(f"LinkedInNode: Relevance AI API error: {error_message}")
            return f"Error: Failed to fetch LinkedIn profile data: {error_message}"

        linkedin_data = response_data.get("linkedin_full_data", {})
        
        extracted_data = {}
        for section in SECTIONS_TO_EXTRACT:
            
            default_value = [] if section in ["educations", "experiences", "languages"] else ""
            extracted_data[section] = linkedin_data.get(section, default_value)

        logging.info(f"Successfully fetched LinkedIn profile data for {profile_url}")
        return json.dumps(extracted_data, indent=2)

    except httpx.HTTPStatusError as e:
        logging.error(f"LinkedInNode: HTTP error while calling Relevance AI API: {str(e)}")
        return f"Error: HTTP error while fetching LinkedIn profile data: {str(e)}"
    except Exception as e:
        logging.error(f"LinkedInNode: Unexpected error while fetching LinkedIn profile data: {str(e)}")
        return f"Error: Unexpected error while fetching LinkedIn profile data: {str(e)}"