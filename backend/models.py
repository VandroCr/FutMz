from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    articles = relationship("Article", back_populates="author")
    comments = relationship("Comment", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text)
    image_url = Column(String(500))
    video_url = Column(String(500))
    audio_url = Column(String(500))
    content_images = Column(JSON)  # Array de URLs das imagens do conteúdo
    category = Column(String(50))  # ex: "Liga Moçambicana", "Futebol Europeu", "Internacional"
    tags = Column(String(500))  # Tags separadas por vírgula
    views_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    published = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)  # Para a home/destaques
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    author = relationship("User", back_populates="articles")
    comments = relationship("Comment", back_populates="article", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="article", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    article = relationship("Article", back_populates="comments")
    user = relationship("User", back_populates="comments")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    user = relationship("User", back_populates="favorites")
    article = relationship("Article", back_populates="favorites")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    logo_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
