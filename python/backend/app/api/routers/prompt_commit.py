from fastapi import APIRouter, Request, Depends, Response, HTTPException
import typing as t

from db.db import get_db
from db.crud import create_prompt_commit, get_latest_prompt_commit
from db.schemas import PromptCommitCreate, PromptCommit
from core.auth import get_current_active_user

prompt_commit_router = r = APIRouter()

@r.post(
    "/prompt_commit",
    response_model=PromptCommit,
    response_model_exclude_none=True,
)
async def save_prompt_commit(
    request: Request,
    commit: PromptCommitCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Save a published version of input/output content
    """
    return create_prompt_commit(db, commit)

@r.get(
    "/prompt_commit",
    response_model=PromptCommit,
    response_model_exclude_none=True,
)
async def get_latest_prompt_commit_handler(
    request: Request,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get the latest published version of input/output content
    """
    commit = get_latest_prompt_commit(db)
    if not commit:
        raise HTTPException(status_code=404, detail="No published content found")
    return commit
