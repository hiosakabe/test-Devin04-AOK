from fastapi import FastAPI, Depends
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware  # ① 追加
from db.db import SessionLocal
from api.routers.users import users_router
from api.routers.helloworld import helloworld_router
from api.routers.todos import todos_router
from api.routers.textbox_draft import textbox_draft_router
from api.routers.textbox_commit import textbox_commit_router
from core.auth import get_current_active_user
from api.routers.auth import auth_router

import os
import sys
sys.path.append('./')

app = FastAPI()

# ② CORS ミドルウェアの設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware('http')
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response

@app.get('/api/v1')
async def root():
    return {'message': 'Hello world'}

app.include_router(
    users_router,
    prefix='/api/v1',
    tags=['users'],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    helloworld_router,
    prefix='/api/v1',
    tags=['helloworld'],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    todos_router,
    #prefix='/api/v1',
    tags=['todos'],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(auth_router, tags=["auth"])

app.include_router(
    textbox_draft_router,
    prefix='/api/v1',
    tags=['textbox_draft'],
    dependencies=[Depends(get_current_active_user)],
)

app.include_router(
    textbox_commit_router,
    prefix='/api/v1',
    tags=['textbox_commit'],
    dependencies=[Depends(get_current_active_user)],
)
