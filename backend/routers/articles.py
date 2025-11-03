from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from database import get_db
from models import Article, User
from schemas import ArticleCreate, ArticleUpdate, ArticleResponse
from dependencies import get_current_user, get_current_admin_user

router = APIRouter()

# Configuração para upload de arquivos
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

async def save_upload_file(upload_file: UploadFile) -> str:
    """Salvar arquivo de upload e retornar URL"""
    # Gerar nome único para o arquivo
    file_extension = upload_file.filename.split('.')[-1] if '.' in upload_file.filename else 'jpg'
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Salvar arquivo
    with open(file_path, "wb") as buffer:
        content = await upload_file.read()
        buffer.write(content)
    
    # Retornar URL relativa
    return f"/uploads/{unique_filename}"

# Gerenar slug a partir do título
def generate_slug(title: str) -> str:
    """Gerar slug a partir do título"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

@router.post("/upload-image",
             summary="Upload de imagem",
             description="Faz upload de uma imagem e retorna a URL")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user)
):
    """Upload de imagem (apenas admin)"""
    print(f"Recebido upload: {file.filename}, tipo: {file.content_type}")
    
    # Verificar se é uma imagem
    if not file.content_type.startswith('image/'):
        print(f"Erro: arquivo não é imagem - {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo deve ser uma imagem"
        )
    
    try:
        # Salvar arquivo
        image_url = await save_upload_file(file)
        print(f"Arquivo salvo com sucesso: {image_url}")
        return {"image_url": image_url}
    except Exception as e:
        print(f"Erro ao salvar arquivo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/upload-video",
             summary="Upload de vídeo",
             description="Faz upload de um vídeo e retorna a URL")
async def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user)
):
    """Upload de vídeo (apenas admin)"""
    print(f"Recebido upload: {file.filename}, tipo: {file.content_type}")
    
    # Verificar se é um vídeo
    if not file.content_type.startswith('video/'):
        print(f"Erro: arquivo não é vídeo - {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo deve ser um vídeo"
        )
    
    try:
        # Salvar arquivo
        video_url = await save_upload_file(file)
        print(f"Vídeo salvo com sucesso: {video_url}")
        return {"video_url": video_url}
    except Exception as e:
        print(f"Erro ao salvar vídeo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.get("/articles", 
            response_model=List[ArticleResponse],
            summary="Listar artigos",
            description="Lista todos os artigos com suporte a filtros e paginação")
def get_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    category: Optional[str] = None,
    published: bool = True,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Listar artigos com filtros"""
    query = db.query(Article)
    
    if published:
        query = query.filter(Article.published == True)
    
    if category:
        query = query.filter(Article.category == category)
    
    if featured is not None:
        query = query.filter(Article.featured == featured)
    
    if search:
        query = query.filter(
            Article.title.ilike(f"%{search}%") | 
            Article.content.ilike(f"%{search}%")
        )
    
    articles = query.order_by(Article.created_at.desc()).offset(skip).limit(limit).all()
    
    # Adicionar nome do autor
    result = []
    for article in articles:
        article_dict = ArticleResponse.model_validate(article).model_dump()
        if article.author:
            article_dict["author_name"] = article.author.username
        result.append(article_dict)
    
    return result

@router.get("/articles/featured",
            response_model=List[ArticleResponse],
            summary="Artigos em destaque",
            description="Retorna os artigos marcados como destaque")
def get_featured_articles(
    limit: int = Query(5, le=20),
    db: Session = Depends(get_db)
):
    """Obter artigos em destaque"""
    articles = db.query(Article).filter(
        Article.featured == True,
        Article.published == True
    ).order_by(Article.created_at.desc()).limit(limit).all()
    
    result = []
    for article in articles:
        article_dict = ArticleResponse.model_validate(article).model_dump()
        if article.author:
            article_dict["author_name"] = article.author.username
        result.append(article_dict)
    
    return result

@router.get("/articles/{article_id}",
            response_model=ArticleResponse,
            summary="Obter artigo",
            description="Retorna os detalhes de um artigo específico")
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Obter artigo por ID"""
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artigo não encontrado"
        )
    
    # Incrementar contador de visualizações
    article.views_count += 1
    db.commit()
    
    result = ArticleResponse.model_validate(article).model_dump()
    if article.author:
        result["author_name"] = article.author.username
    
    return result

@router.post("/articles",
             response_model=ArticleResponse,
             status_code=status.HTTP_201_CREATED,
             summary="Criar artigo",
             description="Cria um novo artigo (apenas administradores)")
def create_article(
    article_data: ArticleCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Criar novo artigo (apenas admin)"""
    # Gerar slug se não fornecido
    slug = article_data.slug or generate_slug(article_data.title)
    
    # Verificar se slug já existe
    if db.query(Article).filter(Article.slug == slug).first():
        slug = f"{slug}-{current_user.id}"
    
    new_article = Article(
        title=article_data.title,
        slug=slug,
        content=article_data.content,
        excerpt=article_data.excerpt,
        image_url=article_data.image_url,
        video_url=article_data.video_url,
        audio_url=article_data.audio_url,
        content_images=article_data.content_images,
        category=article_data.category,
        tags=article_data.tags,
        featured=article_data.featured,
        published=article_data.published,
        author_id=current_user.id
    )
    
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    result = ArticleResponse.model_validate(new_article).model_dump()
    result["author_name"] = current_user.username
    
    return result

@router.put("/articles/{article_id}",
            response_model=ArticleResponse,
            summary="Atualizar artigo",
            description="Atualiza um artigo existente (apenas administradores)")
def update_article(
    article_id: int,
    article_data: ArticleUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Atualizar artigo (apenas admin)"""
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artigo não encontrado"
        )
    
    # Atualizar campos
    update_data = article_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(article, field, value)
    
    db.commit()
    db.refresh(article)
    
    result = ArticleResponse.model_validate(article).model_dump()
    if article.author:
        result["author_name"] = article.author.username
    
    return result

@router.delete("/articles/{article_id}",
               status_code=status.HTTP_204_NO_CONTENT,
               summary="Deletar artigo",
               description="Remove um artigo (apenas administradores)")
def delete_article(
    article_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Deletar artigo (apenas admin)"""
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artigo não encontrado"
        )
    
    db.delete(article)
    db.commit()
    
    return None
