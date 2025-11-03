from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Article Schemas
class ArticleBase(BaseModel):
    title: str
    slug: Optional[str] = None
    content: str
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    audio_url: Optional[str] = None
    content_images: Optional[List[str]] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    featured: bool = False

class ArticleCreate(ArticleBase):
    published: bool = True

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    audio_url: Optional[str] = None
    content_images: Optional[List[str]] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    published: Optional[bool] = None
    featured: Optional[bool] = None

class ArticleResponse(ArticleBase):
    id: int
    views_count: int
    likes_count: int
    author_id: int
    author_name: Optional[str] = None
    published: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Comment Schemas
class CommentCreate(BaseModel):
    content: str
    article_id: int

class CommentResponse(BaseModel):
    id: int
    content: str
    article_id: int
    user_id: int
    username: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Favorite Schemas
class FavoriteCreate(BaseModel):
    article_id: int

class FavoriteResponse(BaseModel):
    id: int
    article_id: int
    article_title: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Team Schemas
class TeamBase(BaseModel):
    name: str
    logo_url: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None

class TeamResponse(TeamBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
