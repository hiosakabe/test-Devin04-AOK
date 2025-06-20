from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os 
import urllib.parse 
import urllib

from azure.identity import DefaultAzureCredential
from .azure_conn import get_connection_uri
import psycopg2 

load_dotenv()

def connect_local():
    database_url = 'sqlite:///./markdown_notes.db'
    return database_url

if os.getenv('AzureConnectionFlag') == "True":
    print("ローカル処理実行中...")
    DATABASE_URL = get_connection_uri()
else:
    print("Azure接続処理実行中...")
    DATABASE_URL = connect_local()

engine = create_engine(DATABASE_URL, echo = True)
session = sessionmaker(
    autocommit=False, autoflush = False, bind = engine
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

## Azure接続用のコード
""" 
def get_connection_uri():
    dbhost = os.getenv('DBHOST')
    dbname = os.getenv('DBNAME')
    dbuser = urllib.parse.quote(os.getenv('DBUSER'))
    sslmode = os.getenv('SSLMODE')

    credential = DefaultAzureCredential()

    password = credential.get_token('https://ossrdbms-aad.database.windows.net/.default').token

    db_uri = f"postgresql://{dbuser}:{password}@{dbhost}/{dbname}?sslmode={sslmode}"
    return db_uri

DATABASE_URL = get_connection_uri()
"""
