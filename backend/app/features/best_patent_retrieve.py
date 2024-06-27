from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import httpx
from datetime import datetime
from config import BACKEND_PORT

router = APIRouter()

class KeywordSearch(BaseModel):
    keywords: List[str]

def search_single_keyword(keyword):
    with httpx.Client() as client:
        response = client.post(f"http://localhost:{BACKEND_PORT}/patent/search", 
                               json={"query": keyword, "rows": 5})
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Patent search failed for keyword: {keyword}")
        return response.json()

@router.post("/search-best-patents")
def search_best_patents(search: KeywordSearch):
    # Search for each keyword separately
    search_results = [search_single_keyword(keyword) for keyword in search.keywords]
    
    # Merge all results
    all_patents = [patent for keyword_results in search_results for patent in keyword_results]
    
    # Remove duplicates (assuming each patent has a unique 'id')
    unique_patents = {patent['id']: patent for patent in all_patents}.values()
    
    # Sort patents by date
    sorted_patents = sorted(unique_patents, key=lambda x: datetime.strptime(x['publicationDate'], '%m-%d-%Y'), reverse=True)
    
    # Get the 10 most recent patents
    recent_patents = sorted_patents[:10]

    # return the title and publication date of the 10 most recent patents
    patentApplicationNumbers = [patent['patentApplicationNumber'] for patent in recent_patents]
    inventionTitles = [patent['inventionTitle'] for patent in recent_patents]
    
    
    return {
        "total_results": len(unique_patents),
        "patentApplicationNumbers": patentApplicationNumbers,
        "inventionTitles": inventionTitles
    }