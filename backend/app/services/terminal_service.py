import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.terminal import Terminal
from app.schemas.terminal import TerminalCreate, TerminalResponse


async def create_terminal(db: AsyncSession, user_id: str, data: TerminalCreate) -> TerminalResponse:
    terminal = Terminal(
        id=uuid.uuid4(),
        user_id=user_id,
        terminal_name=data.terminal_name,
        location=data.location,
        type=data.type,
        storage_capacity_bbl=data.storage_capacity_bbl,
        current_stock_bbl=data.current_stock_bbl,
        berths=data.berths,
        status=data.status,
    )
    db.add(terminal)
    await db.commit()
    await db.refresh(terminal)
    return _to_response(terminal)


async def list_terminals(db: AsyncSession, user_id: str) -> List[TerminalResponse]:
    result = await db.execute(select(Terminal).where(Terminal.user_id == user_id).order_by(Terminal.created_at.desc()))
    return [_to_response(t) for t in result.scalars().all()]


async def get_terminal(db: AsyncSession, user_id: str, terminal_id: str) -> Optional[TerminalResponse]:
    result = await db.execute(select(Terminal).where(Terminal.id == terminal_id, Terminal.user_id == user_id))
    t = result.scalar_one_or_none()
    return _to_response(t) if t else None


async def update_terminal(db: AsyncSession, user_id: str, terminal_id: str, data: TerminalCreate) -> Optional[TerminalResponse]:
    result = await db.execute(select(Terminal).where(Terminal.id == terminal_id, Terminal.user_id == user_id))
    t = result.scalar_one_or_none()
    if not t:
        return None
    for field, value in data.model_dump().items():
        setattr(t, field, value)
    await db.commit()
    await db.refresh(t)
    return _to_response(t)


async def delete_terminal(db: AsyncSession, user_id: str, terminal_id: str) -> bool:
    result = await db.execute(select(Terminal).where(Terminal.id == terminal_id, Terminal.user_id == user_id))
    t = result.scalar_one_or_none()
    if not t:
        return False
    await db.delete(t)
    await db.commit()
    return True


async def get_terminal_stats(db: AsyncSession, user_id: str) -> dict:
    result = await db.execute(
        select(
            func.count(Terminal.id),
            func.coalesce(func.sum(Terminal.storage_capacity_bbl), 0),
            func.coalesce(func.sum(Terminal.current_stock_bbl), 0),
        ).where(Terminal.user_id == user_id)
    )
    row = result.one()
    total_terminals = row[0]
    total_capacity = float(row[1])
    current_stock = float(row[2])
    utilization = (current_stock / total_capacity * 100) if total_capacity > 0 else 0
    return {
        "total_terminals": total_terminals,
        "total_capacity_bbl": total_capacity,
        "current_stock_bbl": current_stock,
        "utilization_pct": round(utilization, 2),
    }


def _to_response(t: Terminal) -> TerminalResponse:
    return TerminalResponse(
        id=str(t.id),
        user_id=str(t.user_id),
        terminal_name=t.terminal_name,
        location=t.location,
        type=t.type,
        storage_capacity_bbl=t.storage_capacity_bbl,
        current_stock_bbl=t.current_stock_bbl,
        berths=t.berths,
        status=t.status,
        created_at=t.created_at,
    )
