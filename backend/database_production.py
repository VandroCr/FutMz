from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configuração para produção (PostgreSQL no Render)
# Automaticamente usa PostgreSQL se DATABASE_URL estiver configurada
# Caso contrário, usa SQLite para desenvolvimento local

DATABASE_URL = os.getenv("DATABASE_URL", None)

if DATABASE_URL:
    # Produção: PostgreSQL (Render)
    # Render fornece DATABASE_URL no formato: postgresql://user:pass@host/db
    # SQLAlchemy precisa: postgresql://...
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    print(f"[PRODUÇÃO] Conectado ao PostgreSQL: {DATABASE_URL.split('@')[1].split('/')[0]}")
else:
    # Desenvolvimento: SQLite
    DB_DIR = "data"
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
    
    SQLALCHEMY_DATABASE_URL = f"sqlite:///./{DB_DIR}/futmz.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
    print("[DESENVOLVIMENTO] Conectado ao SQLite")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def init_db():
    """Inicializar o banco de dados e criar as tabelas"""
    Base.metadata.create_all(bind=engine)
    print("Banco de dados inicializado!")

