from fastapi import APIRouter, Request, Depends, HTTPException, File, UploadFile
import typing as t
import os
import uuid
from datetime import datetime

from app.db.db import get_db
from app.core.auth import get_current_active_user

uploadfile_router = r = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@r.post(
    "/upload/dataset",
    status_code=200,
)
async def upload_dataset(
    request: Request,
    file: UploadFile = File(...),
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Upload a dataset file
    """
    try:
        # Generate a unique filename
        filename = f"{uuid.uuid4()}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save the file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        return {"success": True, "filename": filename, "original_filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@r.post(
    "/upload/evaluation",
    status_code=200,
)
async def upload_evaluation(
    request: Request,
    file: UploadFile = File(...),
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Upload an evaluation file
    """
    try:
        # Generate a unique filename
        filename = f"{uuid.uuid4()}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save the file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        return {"success": True, "filename": filename, "original_filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
