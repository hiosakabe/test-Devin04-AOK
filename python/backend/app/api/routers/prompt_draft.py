from fastapi import APIRouter, Request, Depends, Response, HTTPException
import typing as t

from db.db import get_db
from db.crud import create_prompt_draft, get_latest_prompt_draft
from db.schemas import PromptDraftCreate, PromptDraft
from core.auth import get_current_active_user

prompt_draft_router = r = APIRouter()

@r.post(
    "/prompt_draft",
    response_model=PromptDraft,
    response_model_exclude_none=True,
)
async def save_prompt_draft(
    request: Request,
    draft: PromptDraftCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Save a draft of input/output content
    """
    return create_prompt_draft(db, draft)

@r.get(
    "/prompt_draft",
    response_model=PromptDraft,
    response_model_exclude_none=True,
)
async def get_latest_prompt_draft_handler(
    request: Request,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get the latest draft of input/output content
    """
    draft = get_latest_prompt_draft(db)
    if not draft:
        raise HTTPException(status_code=404, detail="No drafts found")
    return draft
