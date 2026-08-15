from pydantic import BaseModel, Field
from typing import List, Optional

class RecommendationRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    accessibility_needs: List[str] = []
    preferences: List[str] = []

class BarrierReport(BaseModel):
    place_id: int
    barrier_type: str
    description: str
    confidence: str = "Medium"
    reported_by: str = "Demo User"
