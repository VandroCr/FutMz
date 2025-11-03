from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import os

from database import init_db
from routers import auth, articles, comments, favorites, users

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

@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API FutMz",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
