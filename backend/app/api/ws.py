from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set
import json

router = APIRouter()
active_connections: Set[WebSocket] = set()


@router.websocket("/ws/logistics")
async def logistics_websocket(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            for conn in active_connections:
                if conn != websocket:
                    await conn.send_text(json.dumps(msg))
    except WebSocketDisconnect:
        active_connections.discard(websocket)


async def broadcast_alert(alert: dict):
    for conn in active_connections:
        try:
            await conn.send_text(json.dumps(alert))
        except Exception:
            active_connections.discard(conn)
