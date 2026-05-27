from fastapi import FastAPI

from app.routers import auth, courses, flowchart, subjects

app = FastAPI(title="MentorGraduação API", version="0.1.0")

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(subjects.router)
app.include_router(flowchart.router)


@app.get("/health")
def health():
    return {"status": "ok"}
