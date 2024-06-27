from database import get_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from features.patent_search import router as search_router
from features.pdf_upload import router as upload_router
from features.best_patent_retrieve import router as best_patent_router
from features.compare_patents import router as compare_router
from config import CORS_ORIGINS
from sqlalchemy import text
import os

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
app.include_router(best_patent_router, prefix="/patent")
app.include_router(compare_router, prefix="/patent")
app.include_router(upload_router, prefix="/pdf")

db_generator = get_db()
db = next(db_generator)
if (db):
    print("Running migrations")
    migrations_dir = "app/migrations"
    for filename in os.listdir(migrations_dir):
        if filename.endswith(".sql"):
            file_path = os.path.join(migrations_dir, filename)
            print(f"Running migration: {file_path}")
            with open(file_path, "r") as file:
                query = file.read()
                db.execute(text(query))
                db.commit()
            print(f"Migration {file_path} completed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888)
