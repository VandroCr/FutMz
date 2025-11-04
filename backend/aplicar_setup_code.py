#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para aplicar o código gerado ao main.py
"""

from pathlib import Path

def main():
    base_dir = Path(__file__).parent
    
    # Ler código gerado
    setup_file = base_dir / "setup_code_generated.py"
    if not setup_file.exists():
        print(f"❌ Arquivo não encontrado: {setup_file}")
        return
    
    with open(setup_file, "r", encoding="utf-8") as f:
        generated_lines = f.readlines()
    
    # Encontrar início do código (após comentários)
    code_start = 0
    for i, line in enumerate(generated_lines):
        if "CRIAR USUÁRIOS" in line:
            code_start = i
            break
    
    # Pegar apenas o código (remover comentários iniciais)
    setup_code = ''.join(generated_lines[code_start:])
    
    # Ler main.py
    main_file = base_dir / "main.py"
    with open(main_file, "r", encoding="utf-8") as f:
        main_lines = f.readlines()
    
    # Encontrar início e fim do bloco try
    try_idx = None
    except_idx = None
    
    for i, line in enumerate(main_lines):
        if 'try:' in line and 'setup_database' in ''.join(main_lines[max(0,i-5):i]):
            try_idx = i
        if try_idx is not None and 'except Exception as e:' in line:
            except_idx = i
            break
    
    if try_idx is None or except_idx is None:
        print("❌ Não foi possível encontrar o bloco try/except no main.py")
        return
    
    # Criar backup
    backup_file = base_dir / "main.py.backup"
    with open(backup_file, "w", encoding="utf-8") as f:
        f.writelines(main_lines)
    print(f"✅ Backup criado: {backup_file}")
    
    # Construir novo conteúdo
    new_lines = (
        main_lines[:try_idx + 1] +  # Até e incluindo 'try:'
        [setup_code] +  # Código gerado
        main_lines[except_idx:]  # Do 'except' em diante
    )
    
    # Salvar
    with open(main_file, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    
    print(f"✅ main.py atualizado com sucesso!")

if __name__ == "__main__":
    main()
