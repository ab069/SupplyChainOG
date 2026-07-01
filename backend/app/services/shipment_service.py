import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentResponse


async def create_shipment(db: AsyncSession, user_id: str, data: ShipmentCreate) -> ShipmentResponse:
    shipment = Shipment(
        id=uuid.uuid4(),
        user_id=user_id,
        terminal_id=data.terminal_id,
        vessel_name=data.vessel_name,
        product_type=data.product_type,
        volume_bbl=data.volume_bbl,
        origin=data.origin,
        destination=data.destination,
        status=data.status,
        eta=data.eta,
        departure_date=data.departure_date,
        arrival_date=data.arrival_date,
    )
    db.add(shipment)
    await db.commit()
    await db.refresh(shipment)
    return _to_response(shipment)


async def list_shipments(db: AsyncSession, user_id: str, terminal_id: Optional[str] = None) -> List[ShipmentResponse]:
    query = select(Shipment).where(Shipment.user_id == user_id)
    if terminal_id:
        query = query.where(Shipment.terminal_id == terminal_id)
    query = query.order_by(Shipment.created_at.desc())
    result = await db.execute(query)
    return [_to_response(s) for s in result.scalars().all()]


async def get_shipment(db: AsyncSession, user_id: str, shipment_id: str) -> Optional[ShipmentResponse]:
    result = await db.execute(select(Shipment).where(Shipment.id == shipment_id, Shipment.user_id == user_id))
    s = result.scalar_one_or_none()
    return _to_response(s) if s else None


async def update_shipment_status(db: AsyncSession, user_id: str, shipment_id: str, status: str) -> Optional[ShipmentResponse]:
    result = await db.execute(select(Shipment).where(Shipment.id == shipment_id, Shipment.user_id == user_id))
    s = result.scalar_one_or_none()
    if not s:
        return None
    s.status = status
    if status == "arrived" and not s.arrival_date:
        s.arrival_date = datetime.utcnow()
    await db.commit()
    await db.refresh(s)
    return _to_response(s)


async def delete_shipment(db: AsyncSession, user_id: str, shipment_id: str) -> bool:
    result = await db.execute(select(Shipment).where(Shipment.id == shipment_id, Shipment.user_id == user_id))
    s = result.scalar_one_or_none()
    if not s:
        return False
    await db.delete(s)
    await db.commit()
    return True


async def get_shipment_stats(db: AsyncSession, user_id: str) -> dict:
    total = await db.execute(select(func.count(Shipment.id)).where(Shipment.user_id == user_id))
    total_shipments = total.scalar()
    in_transit = await db.execute(
        select(func.count(Shipment.id)).where(Shipment.user_id == user_id, Shipment.status == "in_transit")
    )
    delivered = await db.execute(
        select(func.count(Shipment.id)).where(Shipment.user_id == user_id, Shipment.status == "delivered")
    )
    volume = await db.execute(
        select(func.coalesce(func.sum(Shipment.volume_bbl), 0)).where(Shipment.user_id == user_id)
    )
    return {
        "total_shipments": total_shipments,
        "in_transit": in_transit.scalar(),
        "delivered": delivered.scalar(),
        "total_volume_moved_bbl": float(volume.scalar()),
    }


def _to_response(s: Shipment) -> ShipmentResponse:
    return ShipmentResponse(
        id=str(s.id),
        user_id=str(s.user_id),
        terminal_id=str(s.terminal_id),
        vessel_name=s.vessel_name,
        product_type=s.product_type,
        volume_bbl=s.volume_bbl,
        origin=s.origin,
        destination=s.destination,
        status=s.status,
        eta=s.eta,
        departure_date=s.departure_date,
        arrival_date=s.arrival_date,
        created_at=s.created_at,
    )
