#!/usr/bin/env python3

from app.db.db import get_db
from app.db.crud import create_user
from app.db.schemas import UserCreate
from app.db.db import SessionLocal, engine , DATABASE_URL
from app.db.models import Base
import urllib
from urllib.parse import unquote

from dotenv import load_dotenv
import os 

env_path = './db/.env'

load_dotenv(env_path)
username = os.getenv('SQL_USERNAME')
password = os.getenv('SQL_PASSWORD')

def init() -> None:
    print("接続を開始...")
    print(f"接続先URL: {unquote(DATABASE_URL)}")
    db = SessionLocal()

    Base.metadata.create_all(bind = engine)

    create_user(
        db,
        UserCreate(
            email=username,
            password=password,
            is_active=True,
            is_superuser=True,
        ),
    )


if __name__ == "__main__":
    print("Creating superuser {}".format(username))
    init()
    print("Superuser created")
