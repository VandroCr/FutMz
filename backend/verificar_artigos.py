import sqlite3
import os

# Conectar ao banco
db_path = os.path.join(os.path.dirname(__file__), 'data', 'futmz.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 50)
print("VERIFICANDO BANCO LOCAL")
print("=" * 50)

# Verificar se tabela existe
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='articles'")
table_exists = cursor.fetchone()

if not table_exists:
    print("\n❌ Tabela 'articles' não existe!")
    print("Banco de dados está vazio ou não inicializado.")
else:
    # Contar artigos
    cursor.execute("SELECT COUNT(*) FROM articles")
    count = cursor.fetchone()[0]
    print(f"\n✅ Total de artigos: {count}")
    
    if count > 0:
        # Listar artigos
        cursor.execute("SELECT id, title, category, published FROM articles")
        articles = cursor.fetchall()
        
        print("\nArtigos encontrados:")
        print("-" * 50)
        for article in articles:
            id, title, category, published = article
            status = "✅ Publicado" if published else "❌ Rascunho"
            print(f"\nID: {id}")
            print(f"Título: {title}")
            print(f"Categoria: {category}")
            print(f"Status: {status}")
    else:
        print("\n⚠️  Banco existe mas está vazio!")

# Verificar usuários
cursor.execute("SELECT COUNT(*) FROM users")
user_count = cursor.fetchone()[0]
print(f"\n\nTotal de usuários: {user_count}")

if user_count > 0:
    cursor.execute("SELECT id, username, email, is_admin FROM users")
    users = cursor.fetchall()
    print("\nUsuários encontrados:")
    print("-" * 50)
    for user in users:
        id, username, email, is_admin = user
        role = "👑 Admin" if is_admin else "👤 Usuário"
        print(f"\nID: {id}")
        print(f"Username: {username}")
        print(f"Email: {email}")
        print(f"Tipo: {role}")

conn.close()
print("\n" + "=" * 50)

