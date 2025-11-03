#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera código Python para endpoint /api/setup com os artigos do banco local
"""

import json

# Ler o JSON exportado
with open("../artigos_do_banco_local.json", "r", encoding="utf-8") as f:
    articles = json.load(f)

# Filtrar apenas artigos publicados
published_articles = [a for a in articles if a.get("published")]

print(f"Artigos publicados: {len(published_articles)} de {len(articles)}")
print("\n" + "=" * 70)

# Converter URLs de imagem
for article in published_articles:
    if article.get("image_url"):
        # Substituir URL local por Render
        old_url = article["image_url"]
        if "192.168.43.171:8000" in old_url:
            # Extrair nome do arquivo
            filename = old_url.split("/")[-1]
            new_url = f"https://futmz.onrender.com/uploads/{filename}"
            article["image_url"] = new_url
            print(f"✓ Convertido: {old_url}")
            print(f"           -> {new_url}")
        elif "localhost" in old_url or article["image_url"].startswith("blob:"):
            # Ignorar URLs blob ou localhost
            article["image_url"] = None
            print(f"✗ Removido: {old_url}")

print("\n" + "=" * 70)

# Gerar código Python
code = "        # Criar TODOS os artigos do banco local (apenas publicados)\n"
code += "        sample_articles = [\n"

for article in published_articles:
    code += "            {\n"
    code += f'                "title": """{article["title"]}""",\n'
    code += f'                "slug": "{article["slug"]}",\n'
    code += f'                "excerpt": """{article.get("excerpt", "")}""",\n'
    content = article.get("content", "")
    # Escapar aspas triplas no conteúdo
    content = content.replace('"""', "'''")
    code += f'                "content": """{content}""",\n'
    code += f'                "category": "{article.get("category", "Nacional")}",\n'
    
    # Tags (se existir)
    if article.get("tags"):
        code += f'                "tags": "{article["tags"]}",\n'
    
    # Image URL (se existir)
    if article.get("image_url"):
        code += f'                "image_url": "{article["image_url"]}",\n'
    
    code += f'                "published": {article["published"]},\n'
    code += f'                "featured": {article["featured"]},\n'
    code += "                \"author_id\": admin.id\n"
    code += "            },\n"

code += "        ]\n"

print("CÓDIGO GERADO:")
print("\n" + "=" * 70)
print(code)
print("=" * 70)

# Salvar em arquivo
with open("artigos_setup_code.txt", "w", encoding="utf-8") as f:
    f.write(code)

print("\n[OK] Código salvo em: backend/artigos_setup_code.txt")
print(f"\nTOTAL: {len(published_articles)} artigos publicados")

