import io
from fastapi import FastAPI, HTTPException, Depends,  File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import requests
import random
import os
import string

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    # Add other origins as needed
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PatentSearch(Base):
    __tablename__ = "single_patent_searches"
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, index=True)
    inventionTitle = Column(String)
    inventionSubjectMatterCategory = Column(String)
    patentApplicationNumber = Column(String)
    filingDate = Column(String)
    abstractText = Column(String)
    publicationDate = Column(String)
    publicationDocumentIdentifier = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SearchQuery(BaseModel):
    query: str = Field(..., title="Search Query", description="The search query to use")
    rows: int = Field(5, title="Number of Rows(Patents)", description="The number of rows(patents) to return")

@app.post("/search")
def search_patents(search_query: SearchQuery, db: Session = Depends(get_db)):
    # Check cache
    cached_results = db.query(PatentSearch).filter_by(query=search_query.query).limit(search_query.rows).all()
    if len(cached_results) == search_query.rows:
        return [result.__dict__ for result in cached_results]

    # If not in cache, perform search
    base_url = "https://developer.uspto.gov/ibd-api"
    endpoint = "/v1/application/publications"
    params = {
        "searchText": search_query.query,
        "rows": search_query.rows,
        "largeTextSearchFlag": "Y"
    }
    headers = {"accept": "application/json"}

    try:
        response = requests.get(base_url + endpoint, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

        # Cache the results
        for result in data.get('results', []):
            new_search = PatentSearch(
                query=search_query.query,
                inventionTitle=result.get('inventionTitle'),
                inventionSubjectMatterCategory=result.get('inventionSubjectMatterCategory'),
                patentApplicationNumber=result.get('patentApplicationNumber'),
                filingDate=result.get('filingDate'),
                abstractText=result.get('abstractText', ''),
                publicationDate=result.get('publicationDate'),
                publicationDocumentIdentifier=result.get('publicationDocumentIdentifier')
            )
            db.add(new_search)
        db.commit()

        return data.get('results', [])
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error searching patents: {str(e)}")
    
UPLOAD_DIRECTORY = "uploaded_pdfs"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    contents = await file.read()
    
    # Save the file
    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Read PDF content
    pdf = PdfReader(io.BytesIO(contents))
    num_pages = len(pdf.pages)
    
    # Extract text from the first page (you can modify this to extract from all pages if needed)
    first_page = pdf.pages[0]
    text = first_page.extract_text()
    
    # get procsses id 
    query_id = ''.join(random.sample(string.ascii_letters + string.digits, 10))
    # get random 10 keyword placehoder from the text
    keyword = random.sample(text.split(), 10)
    
    
    return JSONResponse(content={
        "filename": file.filename,
        "query_id": query_id,
        "keyword": keyword
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
