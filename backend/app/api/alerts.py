from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.alert import AlertResponse
from app.services.alert_service import list_alerts, update_alert_status, get_alert_stats

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/stats")
async def alert_stats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_alert_stats(db, str(user.id))


@router.get("/", response_model=list[AlertResponse])
async def list_all(
    status: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await list_alerts(db, str(user.id), status)


@router.patch("/{alert_id}/status", response_model=AlertResponse)
async def update_status(alert_id: str, status: str = Query(...), user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    a = await update_alert_status(db, str(user.id), alert_id, status)
    if not a:
        raise HTTPException(status_code=404, detail="Alert not found")
    return a
