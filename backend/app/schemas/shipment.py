from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ShipmentCreate(BaseModel):
    terminal_id: str
    vessel_name: str
    product_type: str
    volume_bbl: float
    origin: str
    destination: str
    status: str = "scheduled"
    eta: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    arrival_date: Optional[datetime] = None


class ShipmentResponse(BaseModel):
    id: str
    user_id: str
    terminal_id: str
    vessel_name: str
    product_type: str
    volume_bbl: float
    origin: str
    destination: str
    status: str
    eta: Optional[datetime] = None
    departure_date: Optional[datetime] = None
    arrival_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
