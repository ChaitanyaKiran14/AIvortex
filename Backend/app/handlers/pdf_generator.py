# app/handlers/pdf_generator.py
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
import json
from app.models import Node
import os
import uuid
from textwrap import wrap

async def execute(node: Node) -> str:
    try:
        # Create a unique filename
        filename = f"generated_{uuid.uuid4().hex}.pdf"
        
        # Define the output directory
        output_dir = os.path.join(os.getcwd(), "generated_pdfs")
        os.makedirs(output_dir, exist_ok=True)
        
        # Full path for the PDF
        pdf_path = os.path.join(output_dir, filename)
        
        # Get content from previous nodes
        previous_results = getattr(node.data, '_previous_results', [])
        content = ""
        
        # Combine all inputs
        if previous_results:
            for result in previous_results:
                try:
                    # Try to parse as JSON
                    data = json.loads(result)
                    if isinstance(data, dict):
                        content += json.dumps(data, indent=2) + "\n\n"
                    else:
                        content += result + "\n\n"
                except (json.JSONDecodeError, ValueError, TypeError):
                    # Not JSON, use as plain text
                    content += result + "\n\n"
        
        # If no content from previous nodes, use the node's content field
        if not content:
            content = node.data.content or "No content provided."
        
        # Create the PDF
        c = canvas.Canvas(pdf_path, pagesize=letter)
        width, height = letter  # Standard letter size
        
        # Add title
        title = node.data.title if hasattr(node.data, 'title') else 'Generated Document'
        c.setFont("Helvetica-Bold", 16)
        c.drawString(72, height - 72, title)
        
        # Add content with word wrap
        y_position = height - 100  # Start below title
        c.setFont("Helvetica", 12)
        
        # Word wrap content to fit page width
        wrapped_text = wrap(content, 80)  # Wrap at 80 characters
        
        for line in wrapped_text:
            if y_position < 72:  # Check if we need a new page
                c.showPage()
                y_position = height - 72
                c.setFont("Helvetica", 12)
            c.drawString(72, y_position, line)
            y_position -= 20  # Move down for next line
        
        c.save()
        
        return f"PDF generated successfully at {pdf_path}"
        
    except Exception as e:
        return f"Error generating PDF: {str(e)}"