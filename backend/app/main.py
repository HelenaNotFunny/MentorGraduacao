from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routers import auth, courses, flowchart, reviews, subjects

app = FastAPI(title="MentorGraduação API", version="0.1.0")

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(subjects.router)
app.include_router(flowchart.router)
app.include_router(reviews.router)


@app.get("/health")
def health():
    return {"status": "ok"}
