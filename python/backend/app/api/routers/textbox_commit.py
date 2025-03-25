from fastapi import APIRouter, Request, Depends, Response, HTTPException
import typing as t

from backend.app.db.db import get_db
from backend.app.db.crud import create_textbox_commit, get_latest_textbox_commit
from backend.app.db.schemas import TextboxCommitCreate, TextboxCommit
from backend.app.core.auth import get_current_active_user

textbox_commit_router = r = APIRouter()

@r.post(
    "/textbox_commit",
    response_model=TextboxCommit,
    response_model_exclude_none=True,
)
async def save_textbox_commit(
    request: Request,
    commit: TextboxCommitCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Save a published version of text from the text editor
    """
    return create_textbox_commit(db, commit)

@r.get(
    "/textbox_commit",
    response_model=TextboxCommit,
    response_model_exclude_none=True,
)
async def get_latest_textbox_commit(
    request: Request,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get the latest published version of text from the text editor
    """
    commit = get_latest_textbox_commit(db)
    if not commit:
        raise HTTPException(status_code=404, detail="No published texts found")
    return commit
