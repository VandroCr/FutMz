from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Favorite, Article, User
from schemas import FavoriteCreate, FavoriteResponse
from dependencies import get_current_user

router = APIRouter()

@router.get("/favorites", response_model=List[FavoriteResponse])
def get_user_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar favoritos do usuário"""
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).order_by(Favorite.created_at.desc()).all()
    
    result = []
    for favorite in favorites:
        favorite_dict = FavoriteResponse.model_validate(favorite).model_dump()
        if favorite.article:
            favorite_dict["article_title"] = favorite.article.title
        result.append(favorite_dict)
    
    return result

@router.post("/favorites", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(
    favorite_data: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adicionar artigo aos favoritos"""
    # Verificar se artigo existe
    article = db.query(Article).filter(Article.id == favorite_data.article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artigo não encontrado"
        )
    
    # Verificar se já está nos favoritos
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.article_id == favorite_data.article_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Artigo já está nos favoritos"
        )
    
    # Adicionar favorito
    new_favorite = Favorite(
        user_id=current_user.id,
        article_id=favorite_data.article_id
    )
    
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    result = FavoriteResponse.model_validate(new_favorite).model_dump()
    result["article_title"] = article.title
    
    return result

@router.delete("/favorites/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remover artigo dos favoritos"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.article_id == article_id
    ).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorito não encontrado"
        )
    
    db.delete(favorite)
    db.commit()
    
    return None

@router.get("/favorites/check/{article_id}")
def check_favorite(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verificar se artigo está nos favoritos"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.article_id == article_id
    ).first()
    
    return {"is_favorite": favorite is not None}
