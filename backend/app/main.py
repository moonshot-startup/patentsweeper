from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from features.patent_search import router as search_router
from features.pdf_upload import router as upload_router
from config import CORS_ORIGINS

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(search_router, prefix="/patent")
app.include_router(upload_router, prefix="/pdf")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
