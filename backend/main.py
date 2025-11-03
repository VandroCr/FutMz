from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import os

from database import init_db, get_db
from routers import auth, articles, comments, favorites, users, teams
from models import User, Article
from schemas import ArticleCreate
import hashlib
from datetime import datetime

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    
    # Criar diretório uploads se não existir
    uploads_dir = "uploads"
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)
        print(f"Diretório {uploads_dir} criado")
    
    yield
    # Shutdown
    pass

app = FastAPI(
    title="FutMz API",
    description="API para revista digital de futebol moçambicano",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir arquivos estáticos da pasta uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Incluir routers
app.include_router(auth.router, prefix="/api", tags=["Autenticação"])
app.include_router(articles.router, prefix="/api", tags=["Artigos"])
app.include_router(comments.router, prefix="/api", tags=["Comentários"])
app.include_router(favorites.router, prefix="/api", tags=["Favoritos"])
app.include_router(users.router, prefix="/api", tags=["Usuários"])
app.include_router(teams.router, prefix="/api/teams", tags=["Equipas"])

@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API FutMz",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Endpoint temporário para criar admin e artigos de exemplo
@app.post("/api/setup")
async def setup_database():
    """Endpoint temporário para criar admin e artigos de exemplo"""
    def get_password_hash(password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()
    
    db = next(get_db())
    
    try:
        # Verificar se já existe admin
        existing_admin = db.query(User).filter(User.is_admin == True).first()
        if existing_admin:
            return {
                "message": "Admin já existe",
                "username": existing_admin.username,
                "email": existing_admin.email
            }
        
        # Criar admin
        admin = User(
            username="admin",
            email="admin@futmz.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Administrador",
            is_admin=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        # Criar artigos de exemplo
        sample_articles = [
            {
                "title": "⚽ MASSIFICAÇÃO DO FUTEBOL NA ZAMBEZIA GANHA REFORÇO! ⚽",
                "slug": "massificacao-futebol-zambezia-reforco",
                "excerpt": "Dando seguimento à visita de trabalho à Província da Zambezia, a delegação liderada pelo Presidente da Federação Moçambicana de Futebol, Feizal Sidat, procedeu à entrega de 1200 bolas de futebol a 22 associações distritais da província.",
                "content": "Dando seguimento à visita de trabalho à Província da Zambezia, a delegação liderada pelo Presidente da Federação Moçambicana de Futebol, Feizal Sidat, procedeu à entrega de 1200 bolas de futebol a 22 associações distritais da província.\n\nEste importante gesto visa massificar ainda mais o futebol na região, fornecendo material desportivo essencial para o desenvolvimento das categorias de base e o crescimento do futebol local.\n\nAs associações beneficiadas agradeceram a iniciativa e se comprometeram a utilizar adequadamente o material recebido para a promoção e desenvolvimento do futebol nas suas respectivas áreas de atuação.",
                "category": "Nacional",
                "published": True,
                "featured": True,
                "author_id": admin.id
            },
            {
                "title": "⚽ MAPUTO ACOLHE WORKSHOP DE SEGURANÇA DA CAF",
                "slug": "maputo-acolhe-workshop-seguranca-caf",
                "excerpt": "De 28 a 30 de Outubro, a CAF e a FMF realizam o Workshop de Segurança e Protecção no âmbito da Safe Stadium Initiative.",
                "content": "De 28 a 30 de Outubro, a CAF e a FMF realizam o Workshop de Segurança e Protecção no âmbito da Safe Stadium Initiative - uma missão com um objectivo claro: ZERO mortes em jogos de futebol em África! ⚽\n\nO evento reunirá especialistas em segurança desportiva, autoridades locais e representantes de clubes para discutir e implementar medidas de segurança nos estádios moçambicanos.\n\nEste workshop faz parte de uma iniciativa continental da CAF para garantir que os jogos de futebol sejam eventos seguros e agradáveis para todos os espectadores.",
                "category": "Nacional",
                "published": True,
                "featured": True,
                "author_id": admin.id
            },
            {
                "title": "Convocatória Mambas",
                "slug": "convocatoria-mambas",
                "excerpt": "Chiquinho Conde divulga pré-convocatória dos Mambas para a data FIFA de Novembro",
                "content": "O selecionador nacional, Chiquinho Conde, divulgou a pré-convocatória dos Mambas para a próxima data FIFA de Novembro.\n\nA lista inclui jogadores que estão a destacar-se tanto no campeonato nacional como em ligas internacionais.\n\nOs convocados iniciarão os trabalhos de preparação na próxima semana, com foco nos jogos eliminatórios que se aproximam.",
                "category": "Nacional",
                "published": True,
                "featured": False,
                "author_id": admin.id
            }
        ]
        
        created_count = 0
        for article_data in sample_articles:
            existing = db.query(Article).filter(Article.slug == article_data["slug"]).first()
            if not existing:
                article = Article(**article_data)
                db.add(article)
                created_count += 1
        
        db.commit()
        
        return {
            "message": "Setup concluído com sucesso!",
            "admin": {
                "username": "admin",
                "email": "admin@futmz.com",
                "password": "admin123"
            },
            "articles_created": created_count,
            "note": "⚠️ Guarde estas credenciais!"
        }
        
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
