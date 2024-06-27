import os

BACKEND_PORT = os.getenv("BACKEND_PORT", 8000)
DATABASE_URL = os.getenv("DATABASE_URL")
CORS_ORIGINS = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    # Add other origins as needed
]
UPLOAD_DIRECTORY = "uploaded_pdfs"