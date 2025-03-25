from fastapi import APIRouter, Request, Depends, Response, encoders
import typing as t


from backend.app.db.db import get_db
from backend.app.db.crud import (
    get_helloworld
)
from backend.app.db.schemas import HelloWorldBase, HelloWorld
from backend.app.core.auth import get_current_active_user, get_current_active_superuser

helloworld_router = r = APIRouter()

@r.get(
    "/helloworld",
    response_model=t.List[HelloWorld],
    response_model_exclude_none=True,
)
async def helloworld_list(
    response: Response,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Get helloworld
    """
    helloworld = get_helloworld(db)
    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(helloworld)}"
    return helloworld  
