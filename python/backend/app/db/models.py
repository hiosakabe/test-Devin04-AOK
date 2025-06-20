from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
import datetime

from .db import Base

class HelloWorld(Base):
    __tablename__ = "helloworld"
    
    id = Column(String, primary_key = True, index = True)
    name = Column(String)
    
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    notes = relationship("MarkdownNote", back_populates="user")

class TextboxDraft(Base):
    __tablename__ = "textbox_draft"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class TextboxCommit(Base):
    __tablename__ = "textbox_commit"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class MarkdownNote(Base):
    __tablename__ = "markdown_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="notes")

class NoteLink(Base):
    __tablename__ = "note_links"
    
    id = Column(Integer, primary_key=True, index=True)
    source_note_id = Column(Integer, ForeignKey("markdown_notes.id"), nullable=False)
    target_note_id = Column(Integer, ForeignKey("markdown_notes.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    source_note = relationship("MarkdownNote", foreign_keys=[source_note_id])
    target_note = relationship("MarkdownNote", foreign_keys=[target_note_id])
