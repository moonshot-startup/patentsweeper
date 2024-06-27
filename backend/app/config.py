import os

DATABASE_URL = os.getenv("DATABASE_URL")
CORS_ORIGINS = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    # Add other origins as needed
]
UPLOAD_DIRECTORY = "uploaded_pdfs"