import os
import uuid
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from app.models import Node

async def execute(node: Node) -> str:
    try:
        output_dir = "generated_pdfs"
        os.makedirs(output_dir, exist_ok=True)
        pdf_filename = f"generated_{uuid.uuid4().hex}.pdf"
        pdf_path = os.path.join(output_dir, pdf_filename)

        previous_results = getattr(node.data, '_previous_results', [])
        content = "\n\n".join(previous_results) if previous_results else node.data.content or "No content provided."

        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            name='TitleStyle',
            fontSize=16,
            leading=20,
            alignment=1,
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

        story = []
        title = node.data.title if hasattr(node.data, 'title') else 'Candidate Evaluation Report'
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 12))

        sections = content.split("\n\n---\n\n")
        for section in sections:
            lines = section.strip().split("\n")
            if not lines:
                continue

            for line in lines:
                line = line.strip()
                if not line:
                    continue

                if line.startswith("###"):
                    heading = line.replace("###", "").strip()
                    story.append(Paragraph(heading, heading_style))
                    story.append(Spacer(1, 6))
                    continue

                if line.startswith("####"):
                    subheading = line.replace("####", "").strip()
                    story.append(Paragraph(subheading, subheading_style))
                    story.append(Spacer(1, 4))
                    continue

                if line.startswith("**") and line.endswith("**"):
                    bold_text = line.replace("**", "").strip()
                    story.append(Paragraph(f"<b>{bold_text}</b>", body_style))
                    continue

                if line.startswith("- "):
                    bullet_text = f"• {line[2:]}"
                    story.append(Paragraph(bullet_text, body_style))
                    continue

                if line[0].isdigit() and line[1] == ".":
                    numbered_text = line
                    story.append(Paragraph(numbered_text, body_style))
                    continue

                if line.startswith("![Radar Chart]"):
                    continue

                if line.startswith("*") and line.endswith("*"):
                    italic_text = line.replace("*", "").strip()
                    story.append(Paragraph(f"<i>{italic_text}</i>", body_style))
                    continue

                story.append(Paragraph(line, body_style))

            story.append(Spacer(1, 12))

        doc.build(story)
        return f"PDF generated successfully at {pdf_filename}"  # Return only the filename

    except Exception as e:
        return f"Error generating PDF: {str(e)}"