from pydantic import BaseModel
import typing as t
import datetime

class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False

class UserOut(UserBase):
    pass

class HelloWorldBase(BaseModel):
    name: str

class HelloWorld(BaseModel):
    id: str
    name: str

    class Config:
        orm_model = True

class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True


class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"


class TextboxDraftBase(BaseModel):
    content: str
    
class TextboxDraftCreate(TextboxDraftBase):
    pass
    
class TextboxDraft(TextboxDraftBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    class Config:
        orm_mode = True

class TextboxCommitBase(BaseModel):
    content: str
    
class TextboxCommitCreate(TextboxCommitBase):
    pass
    
class TextboxCommit(TextboxCommitBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    class Config:
        orm_mode = True
