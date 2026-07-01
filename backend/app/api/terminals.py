from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.terminal import TerminalCreate, TerminalResponse
from app.services.terminal_service import (
    create_terminal, list_terminals, get_terminal,
    update_terminal, delete_terminal, get_terminal_stats,
)

router = APIRouter(prefix="/api/terminals", tags=["terminals"])


@router.get("/stats")
async def terminal_stats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_terminal_stats(db, str(user.id))


@router.post("/", response_model=TerminalResponse)
async def create(data: TerminalCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await create_terminal(db, str(user.id), data)


@router.get("/", response_model=list[TerminalResponse])
async def list_all(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await list_terminals(db, str(user.id))


@router.get("/{terminal_id}", response_model=TerminalResponse)
async def get(terminal_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    t = await get_terminal(db, str(user.id), terminal_id)
    if not t:
        raise HTTPException(status_code=404, detail="Terminal not found")
    return t


@router.put("/{terminal_id}", response_model=TerminalResponse)
async def update(terminal_id: str, data: TerminalCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    t = await update_terminal(db, str(user.id), terminal_id, data)
    if not t:
        raise HTTPException(status_code=404, detail="Terminal not found")
    return t


@router.delete("/{terminal_id}")
async def delete(terminal_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deleted = await delete_terminal(db, str(user.id), terminal_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Terminal not found")
    return {"message": "Terminal deleted"}
