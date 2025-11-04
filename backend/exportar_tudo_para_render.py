#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para exportar TODOS os dados do banco local (artigos + usuários)
e gerar código Python para o endpoint /api/setup do Render
"""

import sqlite3
import json
import os
import sys
from pathlib import Path

# Fix encoding para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

# Definir caminhos
BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "data" / "futmz.db"

def get_password_hash(password: str) -> str:
    """Simula o mesmo hash usado no backend"""
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def export_all_data():
    """Exporta todos os dados do banco local"""
    print("=" * 70)
    print("EXPORTANDO TODOS OS DADOS DO BANCO LOCAL")
    print("=" * 70)
    
    # Verificar se banco existe
    if not DB_PATH.exists():
        print(f"\n[ERRO] Banco não encontrado em: {DB_PATH}")
        return None, None
    
    # Conectar ao banco
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        # ===== EXPORTAR USUÁRIOS =====
        print("\n[1/2] Exportando usuários...")
        cursor.execute("""
            SELECT id, username, email, hashed_password, full_name, is_admin, created_at
            FROM users
            ORDER BY id
        """)
        
        users = []
        for row in cursor.fetchall():
            users.append({
                "id": row["id"],
                "username": row["username"],
                "email": row["email"],
                "hashed_password": row["hashed_password"],
                "full_name": row["full_name"] or "",
                "is_admin": bool(row["is_admin"]),
                "created_at": row["created_at"]
            })
        
        print(f"   ✅ {len(users)} usuários encontrados")
        
        # ===== EXPORTAR ARTIGOS =====
        print("\n[2/2] Exportando artigos...")
        cursor.execute("""
            SELECT id, title, slug, excerpt, content, category, image_url, 
                   video_url, audio_url, content_images, tags, published, 
                   featured, created_at, updated_at, author_id
            FROM articles
            ORDER BY id
        """)
        
        articles = []
        for row in cursor.fetchall():
            articles.append({
                "id": row["id"],
                "title": row["title"],
                "slug": row["slug"],
                "excerpt": row["excerpt"] or "",
                "content": row["content"],
                "category": row["category"] or "",
                "image_url": row["image_url"],
                "video_url": row["video_url"],
                "audio_url": row["audio_url"],
                "content_images": row["content_images"],
                "tags": row["tags"] or "",
                "published": bool(row["published"]),
                "featured": bool(row["featured"]),
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "author_id": row["author_id"]
            })
        
        print(f"   ✅ {len(articles)} artigos encontrados")
        print(f"   ✅ {sum(1 for a in articles if a['published'])} artigos publicados")
        
        return users, articles
        
    except Exception as e:
        print(f"\n[ERRO] Erro ao exportar dados: {e}")
        return None, None
    finally:
        conn.close()

def convert_image_url(url):
    """Converte URL de imagem local para Render"""
    if not url:
        return None
    
    # Se já é URL do Render, retornar como está
    if "futmz.onrender.com" in url:
        return url
    
    # Se é URL local (IP ou localhost), extrair nome do arquivo
    if "192.168" in url or "localhost" in url or "127.0.0.1" in url:
        filename = url.split("/")[-1]
        return f"https://futmz.onrender.com/uploads/{filename}"
    
    # Se é blob ou inválida, retornar None
    if url.startswith("blob:") or not url.startswith("http"):
        return None
    
    return url

def generate_setup_code(users, articles):
    """Gera código Python para o endpoint /api/setup"""
    print("\n" + "=" * 70)
    print("GERANDO CÓDIGO PARA /api/setup")
    print("=" * 70)
    
    code_lines = []
    
    # Cabeçalho
    code_lines.append("        # ===== CRIAR USUÁRIOS DO BANCO LOCAL =====")
    code_lines.append("        # Mapeamento de IDs antigos para novos")
    code_lines.append("        user_id_map = {}")
    code_lines.append("")
    
    # Criar usuários
    for user in users:
        username = user["username"]
        email = user["email"]
        full_name = user["full_name"] or user["username"]
        is_admin = user["is_admin"]
        old_id = user["id"]
        
        # Verificar se usuário já existe
        code_lines.append(f"        # Usuário: {username} ({'Admin' if is_admin else 'Usuário'})")
        code_lines.append(f"        existing_user_{old_id} = db.query(User).filter(User.username == \"{username}\").first()")
        code_lines.append(f"        if not existing_user_{old_id}:")
        code_lines.append(f"            user_{old_id} = User(")
        code_lines.append(f"                username=\"{username}\",")
        code_lines.append(f"                email=\"{email}\",")
        code_lines.append(f"                hashed_password=\"{user['hashed_password']}\",")
        code_lines.append(f"                full_name=\"{full_name}\",")
        code_lines.append(f"                is_admin={str(is_admin)}")
        code_lines.append(f"            )")
        code_lines.append(f"            db.add(user_{old_id})")
        code_lines.append(f"            db.commit()")
        code_lines.append(f"            db.refresh(user_{old_id})")
        code_lines.append(f"            user_id_map[{old_id}] = user_{old_id}.id")
        code_lines.append(f"            print(f\"✅ Usuário criado: {username}\")")
        code_lines.append(f"        else:")
        code_lines.append(f"            user_id_map[{old_id}] = existing_user_{old_id}.id")
        code_lines.append(f"            print(f\"ℹ️  Usuário já existe: {username}\")")
        code_lines.append("")
    
    # Obter admin para criar artigos
    admin_user = next((u for u in users if u["is_admin"]), None)
    if admin_user:
        code_lines.append("        # Usar admin existente ou criar um novo")
        code_lines.append(f"        admin = db.query(User).filter(User.username == \"{admin_user['username']}\").first()")
        code_lines.append(f"        if not admin:")
        code_lines.append(f"            admin = db.query(User).filter(User.is_admin == True).first()")
        code_lines.append("        if not admin:")
        code_lines.append("            # Criar admin padrão se não existir")
        code_lines.append("            admin = User(")
        code_lines.append("                username=\"admin\",")
        code_lines.append("                email=\"admin@futmz.com\",")
        code_lines.append("                hashed_password=get_password_hash(\"admin123\"),")
        code_lines.append("                full_name=\"Administrador\",")
        code_lines.append("                is_admin=True")
        code_lines.append("            )")
        code_lines.append("            db.add(admin)")
        code_lines.append("            db.commit()")
        code_lines.append("            db.refresh(admin)")
        code_lines.append("")
    
    # Criar artigos
    code_lines.append("        # ===== CRIAR ARTIGOS DO BANCO LOCAL =====")
    code_lines.append("        sample_articles = [")
    
    published_articles = [a for a in articles if a["published"]]
    
    for i, article in enumerate(published_articles):
        # Converter URL de imagem
        image_url = convert_image_url(article["image_url"])
        
        # Escapar aspas no conteúdo
        title = article["title"].replace('"', '\\"').replace('\n', '\\n')
        excerpt = (article["excerpt"] or "").replace('"', '\\"').replace('\n', '\\n')
        content = article["content"].replace('"', '\\"').replace('\n', '\\n')
        
        # Usar admin_id como fallback
        author_id_ref = f"user_id_map.get({article['author_id']}, admin.id)"
        
        code_lines.append("            {")
        code_lines.append(f"                \"title\": \"{title}\",")
        code_lines.append(f"                \"slug\": \"{article['slug']}\",")
        if excerpt:
            code_lines.append(f"                \"excerpt\": \"{excerpt}\",")
        code_lines.append(f"                \"content\": \"{content}\",")
        if article["category"]:
            code_lines.append(f"                \"category\": \"{article['category']}\",")
        if image_url:
            code_lines.append(f"                \"image_url\": \"{image_url}\",")
        code_lines.append(f"                \"published\": True,")
        code_lines.append(f"                \"featured\": {str(article['featured'])},")
        if article["tags"]:
            code_lines.append(f"                \"tags\": \"{article['tags']}\",")
        code_lines.append(f"                \"author_id\": {author_id_ref}")
        code_lines.append("            }" + ("," if i < len(published_articles) - 1 else ""))
    
    code_lines.append("        ]")
    code_lines.append("")
    code_lines.append("        created_count = 0")
    code_lines.append("        for article_data in sample_articles:")
    code_lines.append("            existing = db.query(Article).filter(Article.slug == article_data[\"slug\"]).first()")
    code_lines.append("            if not existing:")
    code_lines.append("                article = Article(**article_data)")
    code_lines.append("                db.add(article)")
    code_lines.append("                created_count += 1")
    code_lines.append("                print(f\"✅ Artigo criado: {article_data['title']}\")")
    code_lines.append("            else:")
    code_lines.append("                print(f\"ℹ️  Artigo já existe: {article_data['title']}\")")
    code_lines.append("")
    code_lines.append("        db.commit()")
    code_lines.append("")
    code_lines.append("        return {")
    code_lines.append("            \"message\": \"Setup concluído com sucesso!\",")
    code_lines.append(f"            \"users_created\": {len(users)},")
    code_lines.append(f"            \"articles_created\": created_count,")
    code_lines.append(f"            \"total_articles_available\": {len(published_articles)}")
    code_lines.append("        }")
    
    return "\n".join(code_lines)

def main():
    # Exportar dados
    users, articles = export_all_data()
    
    if not users or not articles:
        print("\n[ERRO] Não foi possível exportar os dados!")
        return
    
    # Gerar código
    setup_code = generate_setup_code(users, articles)
    
    # Salvar código em arquivo
    output_file = BASE_DIR / "setup_code_generated.py"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# CÓDIGO GERADO PARA /api/setup\n")
        f.write("# Copie este código e cole no lugar do código atual em backend/main.py\n")
        f.write("# Substitua a seção que cria artigos (depois de criar o admin)\n\n")
        f.write(setup_code)
    
    print("\n" + "=" * 70)
    print("✅ CÓDIGO GERADO COM SUCESSO!")
    print("=" * 70)
    print(f"\n📁 Arquivo salvo em: {output_file}")
    print("\n📋 PRÓXIMOS PASSOS:")
    print("   1. Abra o arquivo: backend/setup_code_generated.py")
    print("   2. Copie TODO o conteúdo")
    print("   3. Abra: backend/main.py")
    print("   4. Encontre a função setup_database()")
    print("   5. Substitua a parte que cria artigos pelo código gerado")
    print("   6. Faça commit e push para GitHub")
    print("   7. Aguarde o Render fazer deploy (~5 min)")
    print("   8. Chame: POST https://futmz.onrender.com/api/setup")
    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()
