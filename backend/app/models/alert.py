import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    terminal_id = Column(UUID(as_uuid=True), ForeignKey("terminals.id"), nullable=False)
    title = Column(String(255), nullable=False)
    alert_type = Column(String(50), nullable=False)
    severity = Column(String(20), default="info")
    status = Column(String(20), default="active")
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
