#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para exportar todos os dados do backend local para o Render
"""

import sqlite3
import urllib.request
import urllib.parse
import json
import os
import sys

# URLs
RENDER_URL = "https://futmz.onrender.com"
RENDER_API_URL = f"{RENDER_URL}/api"

# Caminho do banco local
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'futmz.db')

def get_db_connection():
    """Conecta ao banco SQLite local"""
    if not os.path.exists(DB_PATH):
        print(f"❌ Banco de dados não encontrado em: {DB_PATH}")
        sys.exit(1)
    return sqlite3.connect(DB_PATH)

def make_request(url, method="GET", data=None, token=None):
    """Faz uma requisição HTTP"""
    try:
        if data:
            data_bytes = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=data_bytes, method=method)
            req.add_header('Content-Type', 'application/json')
        else:
            req = urllib.request.Request(url, method=method)
        
        if token:
            req.add_header('Authorization', f'Bearer {token}')
        
        with urllib.request.urlopen(req, timeout=30) as response:
            response_data = response.read().decode('utf-8')
            if response_data:
                return response.status, json.loads(response_data)
            return response.status, {}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else "{}"
        try:
            error_data = json.loads(error_body)
        except:
            error_data = {"detail": error_body}
        return e.code, error_data
    except Exception as e:
        return None, {"error": str(e)}

def login_admin():
    """Faz login no Render e retorna o token"""
    print("🔐 Fazendo login no Render...")
    payload = {
        "username": "admin",
        "password": "admin123"
    }
    status, data = make_request(f"{RENDER_API_URL}/users/login", "POST", payload)
    
    if status == 200 and isinstance(data, dict) and "access_token" in data:
        print("✅ Login realizado com sucesso!")
        return data.get('access_token')
    else:
        print(f"❌ Erro ao fazer login: {status}")
        if isinstance(data, dict) and "detail" in data:
            print(f"   {data['detail']}")
        print("\n⚠️  Certifique-se de que o endpoint /api/setup foi executado no Render")
        print(f"   Execute: curl -X POST {RENDER_API_URL}/setup")
        return None

def export_articles(conn, token):
    """Exporta artigos do banco local para o Render"""
    print("\n📰 Exportando artigos...")
    cursor = conn.cursor()
    
    # Buscar todos os artigos
    cursor.execute("""
        SELECT id, title, slug, excerpt, content, category, image_url, 
               video_url, audio_url, content_images, tags, published, 
               featured, created_at, updated_at, author_id
        FROM articles
        ORDER BY id
    """)
    
    articles = cursor.fetchall()
    print(f"   Encontrados {len(articles)} artigos no banco local")
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for article in articles:
        (id, title, slug, excerpt, content, category, image_url, 
         video_url, audio_url, content_images, tags, published, 
         featured, created_at, updated_at, author_id) = article
        
        # Normalizar URL da imagem para Render
        normalized_image_url = None
        if image_url:
            if image_url.startswith('http'):
                # Se já é URL completa, manter
                if 'futmz.onrender.com' in image_url:
                    normalized_image_url = image_url
                elif 'localhost' in image_url or '192.168' in image_url:
                    # Extrair nome do arquivo e criar URL do Render
                    filename = image_url.split('/')[-1]
                    normalized_image_url = f"{RENDER_URL}/uploads/{filename}"
                else:
                    normalized_image_url = image_url
            else:
                # URL relativa, adicionar base do Render
                filename = image_url.lstrip('/uploads/')
                normalized_image_url = f"{RENDER_URL}/uploads/{filename}"
        
        # Converter content_images de string para lista se necessário
        parsed_content_images = None
        if content_images:
            try:
                if isinstance(content_images, str):
                    parsed_content_images = json.loads(content_images)
                else:
                    parsed_content_images = content_images
            except:
                parsed_content_images = []
        
        # Preparar dados do artigo
        article_data = {
            "title": title,
            "slug": slug or None,
            "excerpt": excerpt,
            "content": content,
            "category": category,
            "image_url": normalized_image_url,
            "video_url": video_url,
            "audio_url": audio_url,
            "content_images": parsed_content_images,
            "tags": tags,
            "published": bool(published),
            "featured": bool(featured)
        }
        
        # Verificar se artigo já existe no Render (pela slug ou título)
        # Tentar criar o artigo
        status, response = make_request(
            f"{RENDER_API_URL}/articles",
            "POST",
            article_data,
            token
        )
        
        if status == 201:
            print(f"   ✅ {title[:50]}...")
            success_count += 1
        elif status == 400:
            # Artigo pode já existir, tentar atualizar
            print(f"   ⚠️  {title[:50]}... (pode já existir)")
            skip_count += 1
        else:
            print(f"   ❌ {title[:50]}... Erro: {status}")
            if isinstance(response, dict) and "detail" in response:
                print(f"      {response['detail']}")
            error_count += 1
    
    print(f"\n   ✅ Sucesso: {success_count}")
    print(f"   ⚠️  Pulados: {skip_count}")
    print(f"   ❌ Erros: {error_count}")
    
    return success_count, skip_count, error_count

def export_users(conn):
    """Exporta usuários do banco local (apenas para referência)"""
    print("\n👥 Usuários no banco local:")
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, is_admin FROM users")
    users = cursor.fetchall()
    
    for user in users:
        id, username, email, is_admin = user
        role = "👑 Admin" if is_admin else "👤 Usuário"
        print(f"   {role}: {username} ({email})")
    
    print("\n⚠️  Nota: Usuários devem ser criados manualmente no Render")
    print("   Use o endpoint /api/users/register ou /api/setup")

def main():
    print("=" * 70)
    print("EXPORTAR DADOS DO BACKEND LOCAL PARA O RENDER")
    print("=" * 70)
    
    # Verificar conexão com Render
    print(f"\n🌐 Testando conexão com Render...")
    status, data = make_request(f"{RENDER_URL}/api/health")
    
    if status != 200:
        print(f"❌ Não foi possível conectar ao Render: {status}")
        print(f"   URL: {RENDER_URL}")
        sys.exit(1)
    
    print("✅ Conexão com Render OK!")
    
    # Fazer login
    token = login_admin()
    if not token:
        sys.exit(1)
    
    # Conectar ao banco local
    print("\n📦 Conectando ao banco local...")
    conn = get_db_connection()
    print("✅ Banco local conectado!")
    
    try:
        # Exportar usuários (apenas listar)
        export_users(conn)
        
        # Exportar artigos
        success, skip, errors = export_articles(conn, token)
        
        # Resumo final
        print("\n" + "=" * 70)
        print("RESUMO DA EXPORTAÇÃO")
        print("=" * 70)
        print(f"✅ Artigos criados: {success}")
        print(f"⚠️  Artigos pulados: {skip}")
        print(f"❌ Artigos com erro: {errors}")
        print(f"\n📊 Total processado: {success + skip + errors}")
        print(f"\n🌐 Render URL: {RENDER_URL}")
        print(f"📝 Documentação: {RENDER_URL}/docs")
        
    finally:
        conn.close()
    
    print("\n✅ Exportação concluída!")

if __name__ == "__main__":
    main()
