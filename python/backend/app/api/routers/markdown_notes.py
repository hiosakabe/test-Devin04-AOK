from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
import typing as t

from db.db import get_db
from db.crud_markdown import (
    create_markdown_note, get_markdown_note, get_markdown_notes,
    update_markdown_note, delete_markdown_note, create_note_link,
    get_note_links, search_notes
)
from db.schemas import (
    MarkdownNoteCreate, MarkdownNote, MarkdownNoteUpdate,
    NoteLinkCreate, NoteLink
)
from core.auth import get_current_active_user
from db.models import User

markdown_notes_router = r = APIRouter()

@r.post("/notes", response_model=MarkdownNote)
async def create_note(
    request: Request,
    note: MarkdownNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return create_markdown_note(db, note, current_user.id)

@r.get("/notes", response_model=t.List[MarkdownNote])
async def list_notes(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return get_markdown_notes(db, current_user.id, skip, limit)

@r.get("/notes/{note_id}", response_model=MarkdownNote)
async def get_note(
    request: Request,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    note = get_markdown_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@r.put("/notes/{note_id}", response_model=MarkdownNote)
async def update_note(
    request: Request,
    note_id: int,
    note_update: MarkdownNoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    note = update_markdown_note(db, note_id, note_update, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@r.delete("/notes/{note_id}")
async def delete_note(
    request: Request,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    success = delete_markdown_note(db, note_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}

@r.post("/notes/{note_id}/links", response_model=NoteLink)
async def create_link(
    request: Request,
    note_id: int,
    link: NoteLinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    source_note = get_markdown_note(db, link.source_note_id, current_user.id)
    target_note = get_markdown_note(db, link.target_note_id, current_user.id)
    
    if not source_note or not target_note:
        raise HTTPException(status_code=404, detail="One or both notes not found")
    
    return create_note_link(db, link)

@r.get("/notes/{note_id}/links", response_model=t.List[NoteLink])
async def get_links(
    request: Request,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    note = get_markdown_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return get_note_links(db, note_id)

@r.get("/search", response_model=t.List[MarkdownNote])
async def search_user_notes(
    request: Request,
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return search_notes(db, current_user.id, q)
