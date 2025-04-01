FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files
COPY . .

# Environment variables (use --build-arg or AWS Secrets later)
# Environment variables (use --build-arg or AWS Secrets later)
# Sensitive information should not be hardcoded; use Docker secrets or environment files instead.
# Example:
# ARG GEMINI_API_KEY
# ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Create PDF output directory
RUN mkdir -p generated_pdfs

EXPOSE 8000

# Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

