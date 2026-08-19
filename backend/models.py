from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class RecommendationRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    accessibility_needs: List[str] = Field(default_factory=list)
    preferences: List[str] = Field(default_factory=list)

class BarrierReport(BaseModel):
    model_config = ConfigDict(extra="allow")

    place_id: Optional[int] = None
    barrier_type: str
    description: str
    confidence: str = "Medium"
    reported_by: str = "Demo User"
    destination_name: Optional[str] = None
    location: Optional[str] = None
    status: str = "Under Verification"
    updated: Optional[str] = "Just now"
    photo_name: Optional[str] = None
