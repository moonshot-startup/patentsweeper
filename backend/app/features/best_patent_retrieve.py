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
    try:
        with httpx.Client(timeout=30.0) as client:  # Increased timeout to 30 seconds
            response = client.post(
                f"http://localhost:{BACKEND_PORT}/patent/search",
                json={"query": keyword, "rows": 5},
            )
            response.raise_for_status()  # This will raise an HTTPError for bad responses
            return response.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail=f"Request timed out for keyword: {keyword}")
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"Patent search failed for keyword: {keyword}. Error: {str(exc)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.post("/search-best-patents")
def search_best_patents(search: KeywordSearch):
    print(search)
    # Search for each keyword separately
    search_results = [search_single_keyword(keyword) for keyword in search.keywords]
    
    # Merge all results
    all_patents = [patent for keyword_results in search_results for patent in keyword_results]
    
    # Remove duplicates (assuming each patent has a unique 'id')
    unique_patents = {patent['patentApplicationNumber']: patent for patent in all_patents}.values()
    
    # Sort patents by date
    sorted_patents = sorted(unique_patents, key=lambda x: datetime.strptime(x['publicationDate'], '%m-%d-%Y'), reverse=True)
    
    # Get the 10 most recent patents
    recent_patents = sorted_patents[:10]

    # return the title and publication date of the 10 most recent patents
    patentApplicationNumbers = [patent['patentApplicationNumber'] for patent in recent_patents]
    inventionTitles = [patent['inventionTitle'] for patent in recent_patents]
    
    # return a list of json objects containing the patent application number and invention title
    return [{"patentApplicationNumber": patentApplicationNumbers[i], 
             "inventionTitle": inventionTitles[i]} for i in range(len(recent_patents))]