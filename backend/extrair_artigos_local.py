import sqlite3
import os
import json

# Conectar ao banco
db_path = os.path.join(os.path.dirname(__file__), 'data', 'futmz.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Buscar todos os artigos
cursor.execute("""
    SELECT id, title, slug, excerpt, content, category, image_url, video_url, 
           audio_url, content_images, published, featured, created_at, updated_at, author_id
    FROM articles
""")

articles = cursor.fetchall()

print("=" * 70)
print("ARTIGOS DO BANCO LOCAL")
print("=" * 70)
print("\nTotal de artigos:", len(articles))
print("\n" + "=" * 70)

for article in articles:
    id, title, slug, excerpt, content, category, image_url, video_url, audio_url, content_images, published, featured, created_at, updated_at, author_id = article
    
    print(f"\n--- Artigo ID: {id} ---")
    print(f"Título: {title}")
    print(f"Slug: {slug}")
    print(f"Excerpt: {excerpt}")
    print(f"Category: {category}")
    print(f"Image URL: {image_url}")
    print(f"Published: {published}")
    print(f"Featured: {featured}")
    print(f"Author ID: {author_id}")
    print("\nContent:", content[:200] + "..." if content and len(content) > 200 else content)
    print("-" * 70)

# Exportar para JSON para facilitar
articles_list = []
for article in articles:
    id, title, slug, excerpt, content, category, image_url, video_url, audio_url, content_images, published, featured, created_at, updated_at, author_id = article
    
    articles_list.append({
        "id": id,
        "title": title,
        "slug": slug,
        "excerpt": excerpt,
        "content": content,
        "category": category,
        "image_url": image_url,
        "video_url": video_url,
        "audio_url": audio_url,
        "content_images": content_images,
        "published": published,
        "featured": featured,
        "created_at": created_at,
        "updated_at": updated_at,
        "author_id": author_id
    })

# Salvar JSON
with open("artigos_local.json", "w", encoding="utf-8") as f:
    json.dump(articles_list, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 70)
print("✅ Artigos exportados para: artigos_local.json")
print("=" * 70)

conn.close()

