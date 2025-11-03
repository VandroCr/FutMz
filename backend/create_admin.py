"""
Script para criar um usuário administrador no banco de dados
"""
import sys
import hashlib

def get_password_hash(password: str) -> str:
    """Hash simples da senha"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_admin(username, email, password, full_name="Administrador"):
    """Criar usuário administrador"""
    from database import SessionLocal, init_db
    from models import User
    
    db = SessionLocal()
    
    try:
        # Verificar se já existe admin
        existing_admin = db.query(User).filter(User.username == username).first()
        if existing_admin:
            print(f"❌ Erro: Usuário '{username}' já existe!")
            return False
        
        # Criar admin
        admin = User(
            username=username,
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            is_admin=True
        )
        
        db.add(admin)
        db.commit()
        
        print("✅ Administrador criado com sucesso!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Senha: {password}")
        print("\n⚠️  IMPORTANTE: Guarde estas credenciais!")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar admin: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Criar Administrador - FutMz")
    print("=" * 50)
    
    if len(sys.argv) >= 4:
        username = sys.argv[1]
        email = sys.argv[2]
        password = sys.argv[3]
        full_name = sys.argv[4] if len(sys.argv) > 4 else "Administrador"
    else:
        print("\nUso:")
        print("  python create_admin.py <username> <email> <password> [full_name]")
        print("\nExemplo:")
        print("  python create_admin.py admin admin@futmz.com senha123 'Administrador'")
        
        # Modo interativo
        print("\n--- Modo Interativo ---")
        username = input("Digite o username: ").strip()
        email = input("Digite o email: ").strip()
        password = input("Digite a senha: ").strip()
        full_name = input("Digite o nome completo (Enter para pular): ").strip() or "Administrador"
    
    if not username or not email or not password:
        print("\n❌ Erro: Username, email e senha são obrigatórios!")
        sys.exit(1)
    
    create_admin(username, email, password, full_name)
