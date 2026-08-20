from typing import List, Optional, Union

from pydantic import BaseModel, ConfigDict, Field


class Coordinates(BaseModel):
    latitude: float
    longitude: float


class LocationRequest(Coordinates):
    accuracy: Optional[str] = None


class LocationResponse(Coordinates):
    name: Optional[str] = None
    accuracy: Optional[str] = None
    source: str


class RouteInfo(BaseModel):
    distance_km: Optional[float] = None
    duration_min: Optional[float] = None
    source: str = "unavailable"


class WeatherInfo(BaseModel):
    temperature: Optional[float] = None
    rain: Optional[Union[float, bool]] = None
    condition: str = "Unknown"
    status: str = "Unknown"
    source: str = "unavailable"


class Place(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: Union[int, str]
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    wheelchair_accessible: Optional[bool] = None
    visual_accessibility: Optional[bool] = None
    hearing_accessibility: Optional[bool] = None
    cognitive_accessibility: Optional[bool] = None
    age_friendly: Optional[bool] = None
    accessible_toilet: Optional[bool] = None
    low_stairs: Optional[bool] = None
    crowd_level: Optional[str] = None
    outdoor: Optional[bool] = None
    active_barriers: int = 0
    route: Optional[RouteInfo] = None
    score: Optional[float] = None
    recommendation_reasons: List[str] = Field(default_factory=list)
    barrier_penalty: int = 0
    source: str = "backend"


class PlacesResponse(BaseModel):
    places: List[Place]


class RecommendationRequest(BaseModel):
    destination: str = ""
    accessibility_needs: List[str] = Field(default_factory=list)
    preferences: List[str] = Field(default_factory=list)
    current_location: Optional[Coordinates] = None


class RecommendationResponse(BaseModel):
    destination: Optional[LocationResponse] = None
    weather: WeatherInfo
    recommendations: List[Place]


class RoutePreviewResponse(BaseModel):
    place_id: Union[int, str]
    route: RouteInfo


class BarrierReport(BaseModel):
    model_config = ConfigDict(extra="forbid")

    place_id: Optional[int] = None
    barrier_type: str
    description: str
    confidence: str = "Medium"
    reported_by: str = "Frontend User"
    destination_name: Optional[str] = None
    location: Optional[str] = None
    status: str = "Under Verification"
    updated: Optional[str] = "Just now"
    photo_name: Optional[str] = None


class BarrierResponse(BarrierReport):
    id: int
    reported_at: Optional[str] = None


class BarriersResponse(BaseModel):
    barriers: List[BarrierResponse]