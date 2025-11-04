#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar backend/main.py com o código gerado do setup
"""

from pathlib import Path
import re

BASE_DIR = Path(__file__).parent

def read_generated_code():
    """Lê o código gerado"""
    setup_file = BASE_DIR / "setup_code_generated.py"
    
    if not setup_file.exists():
        print(f"❌ Arquivo não encontrado: {setup_file}")
        return None
    
    with open(setup_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remover comentários no início
    lines = content.split('\n')
    code_start = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('#') and 'CRIAR USUÁRIOS' in line:
            code_start = i
            break
    
    # Pegar apenas o código (sem comentários de cabeçalho)
    code = '\n'.join(lines[code_start:])
    
    return code

def update_main_py():
    """Atualiza o main.py com o código gerado"""
    main_file = BASE_DIR / "main.py"
    
    if not main_file.exists():
        print(f"❌ Arquivo não encontrado: {main_file}")
        return False
    
    # Ler main.py
    with open(main_file, "r", encoding="utf-8") as f:
        main_content = f.read()
    
    # Ler código gerado
    setup_code = read_generated_code()
    if not setup_code:
        return False
    
    # Encontrar a função setup_database
    pattern = r'(# Endpoint temporário.*?async def setup_database\(\):.*?"""Endpoint temporário.*?""".*?def get_password_hash\(password: str\) -> str:.*?return hashlib\.sha256\(password\.encode\(\)\)\.hexdigest\(\)\s+db = next\(get_db\(\)\)\s+try:.*?)(# Verificar se já existe admin.*?existing_admin = db\.query\(User\)\.filter\(User\.is_admin == True\)\.first\(\).*?if existing_admin:.*?return \{.*?"message": "Admin já existe",.*?"username": existing_admin\.username,.*?"email": existing_admin\.email.*?\}\s+)(.*?)(\s+except Exception as e:.*?db\.rollback\(\).*?return \{"error": str\(e\)\}.*?finally:.*?db\.close\(\))'
    
    # Regex mais simples: encontrar desde "try:" até "except Exception"
    try_pattern = r'(        try:\s+)(.*?)(\s+except Exception as e:)'
    
    match = re.search(try_pattern, main_content, re.DOTALL)
    
    if not match:
        print("❌ Não foi possível encontrar a função setup_database no main.py")
        print("   Atualização manual necessária!")
        return False
    
    # Construir novo conteúdo
    before_try = match.group(1)
    after_except = "\n        except Exception as e:\n            db.rollback()\n            return {\"error\": str(e)}\n        finally:\n            db.close()"
    
    # Remover comentários do código gerado e adicionar indentação correta
    setup_code_lines = setup_code.split('\n')
    # Remover linhas vazias no início
    while setup_code_lines and not setup_code_lines[0].strip():
        setup_code_lines.pop(0)
    
    # Juntar tudo
    new_content = main_content[:match.start()] + before_try + setup_code + after_except + main_content[match.end():]
    
    # Criar backup
    backup_file = BASE_DIR / "main.py.backup"
    with open(backup_file, "w", encoding="utf-8") as f:
        f.write(main_content)
    print(f"✅ Backup criado: {backup_file}")
    
    # Salvar novo conteúdo
    with open(main_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"✅ main.py atualizado com sucesso!")
    return True

def main():
    print("=" * 70)
    print("ATUALIZANDO backend/main.py COM CÓDIGO GERADO")
    print("=" * 70)
    
    if update_main_py():
        print("\n✅ SUCESSO!")
        print("\n📋 PRÓXIMOS PASSOS:")
        print("   1. Verifique o arquivo: backend/main.py")
        print("   2. Faça commit e push para GitHub:")
        print("      git add backend/main.py")
        print("      git commit -m \"Add: Importar todos os dados do banco local para Render\"")
        print("      git push")
        print("   3. Aguarde o Render fazer deploy (~5 min)")
        print("   4. Chame: POST https://futmz.onrender.com/api/setup")
    else:
        print("\n❌ FALHA na atualização!")
        print("\n📋 ATUALIZAÇÃO MANUAL NECESSÁRIA:")
        print("   1. Abra: backend/setup_code_generated.py")
        print("   2. Copie o código (exceto comentários do início)")
        print("   3. Abra: backend/main.py")
        print("   4. Encontre a função setup_database()")
        print("   5. Substitua o conteúdo dentro do 'try:' pelo código copiado")

if __name__ == "__main__":
    main()
