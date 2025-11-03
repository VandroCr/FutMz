#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para exportar todos os artigos do banco local para JSON
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
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Definir caminhos
BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "backend" / "data" / "futmz.db"
OUTPUT_FILE = BASE_DIR / "artigos_do_banco_local.json"

def main():
    print("=" * 70)
    print("EXPORTANDO ARTIGOS DO BANCO LOCAL")
    print("=" * 70)
    
    # Verificar se banco existe
    if not DB_PATH.exists():
        print(f"\n[ERRO] Banco nao encontrado em: {DB_PATH}")
        return
    
    # Conectar ao banco
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        # Buscar todos os artigos
        cursor.execute("""
            SELECT id, title, slug, excerpt, content, category, image_url, 
                   video_url, audio_url, content_images, tags, published, 
                   featured, created_at, updated_at, author_id
            FROM articles
            ORDER BY id
        """)
        
        rows = cursor.fetchall()
        
        if not rows:
            print("\n[AVISO] Nenhum artigo encontrado no banco!")
            return
        
        # Converter para dicionários
        articles = []
        for row in rows:
            article = {
                "id": row["id"],
                "title": row["title"],
                "slug": row["slug"],
                "excerpt": row["excerpt"],
                "content": row["content"],
                "category": row["category"],
                "image_url": row["image_url"],
                "video_url": row["video_url"],
                "audio_url": row["audio_url"],
                "content_images": row["content_images"],
                "tags": row["tags"],
                "published": bool(row["published"]),
                "featured": bool(row["featured"]),
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "author_id": row["author_id"]
            }
            articles.append(article)
        
        # Salvar em JSON
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        
        print(f"\n[OK] Total de artigos exportados: {len(articles)}")
        print(f"\n[OK] Arquivo salvo em: {OUTPUT_FILE}")
        
        # Mostrar resumo
        print("\n" + "=" * 70)
        print("RESUMO DOS ARTIGOS:")
        print("=" * 70)
        
        for article in articles:
            status = "[PUBLICADO]" if article["published"] else "[RASCUNHO]"
            featured = "[DESTAQUE]" if article["featured"] else "         "
            print(f"\n{status} {featured} ID {article['id']}: {article['title'][:60]}")
            if article.get("image_url"):
                print(f"   IMAGEM: {article['image_url']}")
        
        print("\n" + "=" * 70)
        
    except Exception as e:
        print(f"\n[ERRO] Erro ao exportar: {e}")
    
    finally:
        conn.close()

if __name__ == "__main__":
    main()

