from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import places, recommendations, barriers

app = FastAPI(
    title="Accessible Journey Planner API",
    description="Backend API foundation for Accessible Journey Planner Hackathon MVP",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(places.router)
app.include_router(recommendations.router)
app.include_router(barriers.router)

@app.get("/")
def root():
    return {"message": "Accessible Journey Planner API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
