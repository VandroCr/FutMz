from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Comment, Article, User
from schemas import CommentCreate, CommentResponse
from dependencies import get_current_user

router = APIRouter()

@router.get("/articles/{article_id}/comments", response_model=List[CommentResponse])
def get_article_comments(article_id: int, db: Session = Depends(get_db)):
    """Listar comentários de um artigo"""
    comments = db.query(Comment).filter(
        Comment.article_id == article_id
    ).order_by(Comment.created_at.desc()).all()
    
    result = []
    for comment in comments:
        comment_dict = CommentResponse.model_validate(comment).model_dump()
        if comment.user:
            comment_dict["username"] = comment.user.username
        result.append(comment_dict)
    
    return result

@router.post("/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adicionar comentário a um artigo"""
    # Verificar se artigo existe
    article = db.query(Article).filter(Article.id == comment_data.article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artigo não encontrado"
        )
    
    # Criar comentário
    new_comment = Comment(
        content=comment_data.content,
        article_id=comment_data.article_id,
        user_id=current_user.id
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    result = CommentResponse.model_validate(new_comment).model_dump()
    result["username"] = current_user.username
    
    return result

@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletar comentário (próprio comentário ou admin)"""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comentário não encontrado"
        )
    
    # Verificar se é o dono do comentário ou admin
    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão para deletar este comentário"
        )
    
    db.delete(comment)
    db.commit()
    
    return None
