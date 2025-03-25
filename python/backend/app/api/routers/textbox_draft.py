from fastapi import APIRouter, Request, Depends, Response, HTTPException
import typing as t

from backend.app.db.db import get_db
from backend.app.db.crud import create_textbox_draft, get_latest_textbox_draft
from backend.app.db.schemas import TextboxDraftCreate, TextboxDraft
from backend.app.core.auth import get_current_active_user

textbox_draft_router = r = APIRouter()

@r.post(
    "/textbox_draft",
    response_model=TextboxDraft,
    response_model_exclude_none=True,
)
async def save_textbox_draft(
    request: Request,
    draft: TextboxDraftCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Save a draft of text from the text editor
    """
    return create_textbox_draft(db, draft)

@r.get(
    "/textbox_draft",
    response_model=TextboxDraft,
    response_model_exclude_none=True,
)
async def get_latest_textbox_draft(
    request: Request,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get the latest draft of text from the text editor
    """
    draft = get_latest_textbox_draft(db)
    if not draft:
        raise HTTPException(status_code=404, detail="No drafts found")
    return draft
