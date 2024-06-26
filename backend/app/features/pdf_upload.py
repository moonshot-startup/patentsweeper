from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from config import UPLOAD_DIRECTORY
from .keywords_extractions import extract_keywords
from PyPDF2 import PdfReader
import os
import io

import hashlib


def process_pdf(contents):
    pdf = PdfReader(io.BytesIO(contents))
    num_pages = len(pdf.pages)

    # Extract text from the PDF
    text = '\n------------New Page------------\n'.join([page.extract_text() for page in pdf.pages])
    # get process id based on the hash of the text
    query_id = hashlib.md5(text.encode()).hexdigest()
    keyword = extract_keywords(text)
    return {
        "query_id": query_id,
        "keyword": keyword
    }


router = APIRouter()

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await file.read()

    # Save the file
    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Process the PDF
    result = process_pdf(contents)

    return JSONResponse(content={
        "filename": file.filename,
        "query_id": result["query_id"],
        "keyword": result["keyword"]
    })
