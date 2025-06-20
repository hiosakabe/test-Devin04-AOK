from sqlalchemy.orm import Session
from sqlalchemy import and_
from . import models, schemas
import typing as t

def create_markdown_note(db: Session, note: schemas.MarkdownNoteCreate, user_id: int) -> models.MarkdownNote:
    db_note = models.MarkdownNote(
        title=note.title,
        content=note.content,
        user_id=user_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_markdown_note(db: Session, note_id: int, user_id: int) -> t.Optional[models.MarkdownNote]:
    return db.query(models.MarkdownNote).filter(
        and_(models.MarkdownNote.id == note_id, models.MarkdownNote.user_id == user_id)
    ).first()

def get_markdown_notes(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> t.List[models.MarkdownNote]:
    return db.query(models.MarkdownNote).filter(
        models.MarkdownNote.user_id == user_id
    ).offset(skip).limit(limit).all()

def update_markdown_note(db: Session, note_id: int, note_update: schemas.MarkdownNoteUpdate, user_id: int) -> t.Optional[models.MarkdownNote]:
    db_note = get_markdown_note(db, note_id, user_id)
    if not db_note:
        return None
    
    update_data = note_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_note, field, value)
    
    db.commit()
    db.refresh(db_note)
    return db_note

def delete_markdown_note(db: Session, note_id: int, user_id: int) -> bool:
    db_note = get_markdown_note(db, note_id, user_id)
    if not db_note:
        return False
    
    db.delete(db_note)
    db.commit()
    return True

def create_note_link(db: Session, link: schemas.NoteLinkCreate) -> models.NoteLink:
    db_link = models.NoteLink(
        source_note_id=link.source_note_id,
        target_note_id=link.target_note_id
    )
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

def get_note_links(db: Session, note_id: int) -> t.List[models.NoteLink]:
    return db.query(models.NoteLink).filter(
        models.NoteLink.source_note_id == note_id
    ).all()

def search_notes(db: Session, user_id: int, query: str) -> t.List[models.MarkdownNote]:
    return db.query(models.MarkdownNote).filter(
        and_(
            models.MarkdownNote.user_id == user_id,
            models.MarkdownNote.title.ilike(f"%{query}%")
        )
    ).all()
