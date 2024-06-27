import io
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from PyPDF2 import PdfReader
from database import get_db
from features.patent_search import PatentSearch
from features.keywords_extractions import extract_keywords

router = APIRouter()

class similarityCheck(BaseModel):
    """
    Check the similarity between the two patent texts and provide a similarity score and explanation.
    """
    score: float = Field(..., title="Similarity Score", description="The similarity score between the two texts")
    explanation: str = Field(..., title="Explanation", description="Detailed explanation of the similarity score")

class ComparisonResult(BaseModel):
    patent_application_number: str
    similarity_score: float
    explanation: str
    filelocationURI: str

def extract_text_from_pdf(file: UploadFile) -> str:
    pdf_content = file.file.read()
    pdf = PdfReader(io.BytesIO(pdf_content))
    text = '\n'.join([page.extract_text() for page in pdf.pages])
    return text

def get_patent_details(patent_application_number: str, db: Session) -> dict:
    patent = db.query(PatentSearch).filter(PatentSearch.patentApplicationNumber == patent_application_number).first()
    if not patent:
        raise HTTPException(status_code=404, detail=f"Patent with application number {patent_application_number} not found")
    return {
        "inventionTitle": patent.inventionTitle,
        "abstractText": patent.abstractText,
        "patentApplicationNumber": patent.patentApplicationNumber,
        "filelocationURI": patent.filelocationURI
    }

def compare_texts(pdf_text: str, patent_text: str, patent_application_number: str, filelocationURI: str) -> ComparisonResult:
    chat = ChatGroq(temperature=0.1, model="llama3-70b-8192")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an AI assistant specialized in comparing patent documents. Your task is to compare a given text from a PDF file with a patent text and provide a similarity score and explanation."),
        ("human", "Compare the following two texts and provide a similarity score between 0% and 100%, along with a detailed explanation of your reasoning:\n\nPDF Text: {pdf_text}\n\nPatent Text: {patent_text}")
    ])
    
    structured_llm = chat.with_structured_output(similarityCheck)
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "pdf_text": pdf_text,
        "patent_text": patent_text
    })
    
    # Extract similarity score and explanation from the response
    similarity_score = response['score']
    explanation = response['explanation']
    
    return ComparisonResult(
        patent_application_number=patent_application_number,
        similarity_score=similarity_score,
        explanation=explanation,
        filelocationURI=filelocationURI
    )

@router.post("/compare", response_model=ComparisonResult)
async def compare_patents(
    file: UploadFile = File(...),
    patent_application_number: str = Form(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        pdf_text = extract_text_from_pdf(file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

    
    patent_details = get_patent_details(patent_application_number, db)
    patent_text = f"Title: {patent_details['inventionTitle']}\nAbstract: {patent_details['abstractText']}\nKeywords: {', '.join(extract_keywords(patent_details['abstractText']))}"
    
    result = compare_texts(pdf_text, patent_text, patent_application_number, patent_details['filelocationURI'])
    
    return result
