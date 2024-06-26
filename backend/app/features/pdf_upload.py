from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from config import UPLOAD_DIRECTORY
import os
import io
import random
import string
from PyPDF2 import PdfReader


def process_pdf(contents):
    pdf = PdfReader(io.BytesIO(contents))
    num_pages = len(pdf.pages)

    # Extract text from the first page (you can modify this to extract from all pages if needed)
    first_page = pdf.pages[0]
    text = first_page.extract_text()

    # get process id
    query_id = ''.join(random.sample(string.ascii_letters + string.digits, 10))
    # get random 10 keyword placeholder from the text
    keyword = random.sample(text.split(), 10)

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
