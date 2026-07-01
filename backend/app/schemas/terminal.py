from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TerminalCreate(BaseModel):
    terminal_name: str
    location: str
    type: str
    storage_capacity_bbl: float = 0
    current_stock_bbl: float = 0
    berths: int = 0
    status: str = "active"


class TerminalResponse(BaseModel):
    id: str
    user_id: str
    terminal_name: str
    location: str
    type: str
    storage_capacity_bbl: float
    current_stock_bbl: float
    berths: int
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
