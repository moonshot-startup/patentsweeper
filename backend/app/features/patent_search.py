from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String
from database import Base, get_db
from pydantic import BaseModel, Field
import requests

# Models
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
    filelocationURI= Column(String)
    claimText = Column(String)
    descriptionText = Column(String)
    
# Schema
class SearchQuery(BaseModel):
    query: str = Field(..., title="Search Query", description="The search query to use")
    rows: int = Field(5, title="Number of Rows(Patents)", description="The number of rows(patents) to return")

# Router
router = APIRouter()
@router.post("/search")
def search_patents(search_query: SearchQuery, db: Session = Depends(get_db)):
    # Check cache
    cached_results = db.query(PatentSearch).filter_by(query=search_query.query).limit(search_query.rows).all()
    if 0 < search_query.rows <= len(cached_results):
        return [result.__dict__ for result in cached_results[:search_query.rows]]

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
                query=search_query.query.replace("-", " "),
                inventionTitle=result.get('inventionTitle'),
                inventionSubjectMatterCategory=result.get('inventionSubjectMatterCategory'),
                patentApplicationNumber=result.get('patentApplicationNumber'),
                filingDate=result.get('filingDate'),
                publicationDate=result.get('publicationDate'),
                publicationDocumentIdentifier=result.get('publicationDocumentIdentifier'),
                filelocationURI=result.get('filelocationURI'),
                abstractText=result.get('abstractText', [""])[0][:64000],
                claimText=result.get('claimText', [""])[0][:64000],
                descriptionText=result.get('descriptionText', [""])[0][:64000],
            )
            db.add(new_search)
        db.commit()

        return data.get('results', [])
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error searching patents: {str(e)}")