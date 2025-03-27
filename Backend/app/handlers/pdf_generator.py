# C:\AdvanceLearnings\AIvortex\Backend\app\handlers\pdf_generator.py
import os
import uuid
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from app.models import Node

async def execute(node: Node) -> str:
    try:
        # Define the output PDF path
        output_dir = "generated_pdfs"
        os.makedirs(output_dir, exist_ok=True)
        pdf_filename = f"generated_{uuid.uuid4().hex}.pdf"
        pdf_path = os.path.join(output_dir, pdf_filename)

        # Get content from previous nodes
        previous_results = getattr(node.data, '_previous_results', [])
        content = "\n\n".join(previous_results) if previous_results else node.data.content or "No content provided."

        # Create a PDF document
        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        styles = getSampleStyleSheet()

        # Define custom styles
        title_style = ParagraphStyle(
            name='TitleStyle',
            fontSize=16,
            leading=20,
            alignment=1,  # Center
            spaceAfter=12,
            fontName="Helvetica-Bold",
            textColor=colors.darkblue
        )

        heading_style = ParagraphStyle(
            name='HeadingStyle',
            fontSize=14,
            leading=16,
            spaceBefore=12,
            spaceAfter=6,
            fontName="Helvetica-Bold",
            textColor=colors.darkblue
        )

        subheading_style = ParagraphStyle(
            name='SubheadingStyle',
            fontSize=12,
            leading=14,
            spaceBefore=10,
            spaceAfter=4,
            fontName="Helvetica-Bold",
            textColor=colors.darkblue
        )

        body_style = ParagraphStyle(
            name='BodyStyle',
            fontSize=12,
            leading=14,
            spaceAfter=6,
            fontName="Helvetica"
        )

        # Build the story (PDF content)
        story = []

        # Title
        title = node.data.title if hasattr(node.data, 'title') else 'Candidate Evaluation Report'
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 12))

        # Split the content into sections
        sections = content.split("\n\n---\n\n")
        for section in sections:
            lines = section.strip().split("\n")
            if not lines:
                continue

            # Handle each section
            for line in lines:
                line = line.strip()
                if not line:
                    continue

                # Handle headings
                if line.startswith("###"):
                    heading = line.replace("###", "").strip()
                    story.append(Paragraph(heading, heading_style))
                    story.append(Spacer(1, 6))
                    continue

                # Handle subheadings (e.g., #### Resourcefulness)
                if line.startswith("####"):
                    subheading = line.replace("####", "").strip()
                    story.append(Paragraph(subheading, subheading_style))
                    story.append(Spacer(1, 4))
                    continue

                # Handle bold text (e.g., **Evidence:**)
                if line.startswith("**") and line.endswith("**"):
                    bold_text = line.replace("**", "").strip()
                    story.append(Paragraph(f"<b>{bold_text}</b>", body_style))
                    continue

                # Handle bullet points
                if line.startswith("- "):
                    bullet_text = f"• {line[2:]}"
                    story.append(Paragraph(bullet_text, body_style))
                    continue

                # Handle numbered lists
                if line[0].isdigit() and line[1] == ".":
                    numbered_text = line
                    story.append(Paragraph(numbered_text, body_style))
                    continue

                # Handle chart placeholder (remove since we're using text-based bar chart)
                if line.startswith("![Radar Chart]"):
                    continue  # Skip the placeholder since the LLM now provides a text-based chart

                # Handle italicized text (e.g., *Note*: ...)
                if line.startswith("*") and line.endswith("*"):
                    italic_text = line.replace("*", "").strip()
                    story.append(Paragraph(f"<i>{italic_text}</i>", body_style))
                    continue

                # Default to body text
                story.append(Paragraph(line, body_style))

            story.append(Spacer(1, 12))

        # Build the PDF
        doc.build(story)
        return f"PDF generated successfully at {pdf_path}"

    except Exception as e:
        return f"Error generating PDF: {str(e)}"