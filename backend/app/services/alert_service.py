import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.alert import Alert
from app.schemas.alert import AlertResponse


async def create_alert(db: AsyncSession, user_id: str, terminal_id: str, title: str, alert_type: str, severity: str = "info", description: Optional[str] = None) -> AlertResponse:
    alert = Alert(
        id=uuid.uuid4(),
        user_id=user_id,
        terminal_id=terminal_id,
        title=title,
        alert_type=alert_type,
        severity=severity,
        description=description,
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    return _to_response(alert)


async def list_alerts(db: AsyncSession, user_id: str, status_filter: Optional[str] = None) -> List[AlertResponse]:
    query = select(Alert).where(Alert.user_id == user_id)
    if status_filter:
        query = query.where(Alert.status == status_filter)
    query = query.order_by(Alert.created_at.desc())
    result = await db.execute(query)
    return [_to_response(a) for a in result.scalars().all()]


async def update_alert_status(db: AsyncSession, user_id: str, alert_id: str, status: str) -> Optional[AlertResponse]:
    result = await db.execute(select(Alert).where(Alert.id == alert_id, Alert.user_id == user_id))
    a = result.scalar_one_or_none()
    if not a:
        return None
    a.status = status
    await db.commit()
    await db.refresh(a)
    return _to_response(a)


async def get_alert_stats(db: AsyncSession, user_id: str) -> dict:
    total = await db.execute(select(func.count(Alert.id)).where(Alert.user_id == user_id))
    active = await db.execute(
        select(func.count(Alert.id)).where(Alert.user_id == user_id, Alert.status == "active")
    )
    high = await db.execute(
        select(func.count(Alert.id)).where(Alert.user_id == user_id, Alert.severity == "high", Alert.status == "active")
    )
    return {
        "total_alerts": total.scalar(),
        "active_alerts": active.scalar(),
        "high_severity_active": high.scalar(),
    }


def _to_response(a: Alert) -> AlertResponse:
    return AlertResponse(
        id=str(a.id),
        user_id=str(a.user_id),
        terminal_id=str(a.terminal_id),
        title=a.title,
        alert_type=a.alert_type,
        severity=a.severity,
        status=a.status,
        description=a.description,
        created_at=a.created_at,
    )
