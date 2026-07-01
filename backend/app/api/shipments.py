from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.shipment import ShipmentCreate, ShipmentResponse
from app.services.shipment_service import (
    create_shipment, list_shipments, get_shipment,
    update_shipment_status, delete_shipment, get_shipment_stats,
)

router = APIRouter(prefix="/api/shipments", tags=["shipments"])


@router.get("/stats")
async def shipment_stats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_shipment_stats(db, str(user.id))


@router.post("/", response_model=ShipmentResponse)
async def create(data: ShipmentCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await create_shipment(db, str(user.id), data)


@router.get("/", response_model=list[ShipmentResponse])
async def list_all(
    terminal_id: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await list_shipments(db, str(user.id), terminal_id)


@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def get(shipment_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    s = await get_shipment(db, str(user.id), shipment_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return s


@router.patch("/{shipment_id}/status", response_model=ShipmentResponse)
async def update_status(shipment_id: str, status: str = Query(...), user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    s = await update_shipment_status(db, str(user.id), shipment_id, status)
    if not s:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return s


@router.delete("/{shipment_id}")
async def delete(shipment_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deleted = await delete_shipment(db, str(user.id), shipment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return {"message": "Shipment deleted"}
