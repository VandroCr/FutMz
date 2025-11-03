#!/usr/bin/env python3
"""
Script para adicionar o campo content_images à tabela articles
"""

import sqlite3
import os

def add_content_images_field():
    """Adiciona o campo content_images à tabela articles"""
    
    # Caminho para o banco de dados
    db_path = "data/futmz.db"
    
    if not os.path.exists(db_path):
        print(f"❌ Banco de dados {db_path} não encontrado!")
        return False
    
    try:
        # Conectar ao banco
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se o campo já existe
        cursor.execute("PRAGMA table_info(articles)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'content_images' in columns:
            print("✅ Campo content_images já existe!")
            conn.close()
            return True
        
        # Adicionar o campo content_images
        print("🔄 Adicionando campo content_images...")
        cursor.execute("ALTER TABLE articles ADD COLUMN content_images TEXT")
        
        # Confirmar mudanças
        conn.commit()
        conn.close()
        
        print("✅ Campo content_images adicionado com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao adicionar campo: {e}")
        if 'conn' in locals():
            conn.close()
        return False

if __name__ == "__main__":
    print("🚀 Adicionando campo content_images à tabela articles...")
    success = add_content_images_field()
    
    if success:
        print("\n🎉 Migração concluída com sucesso!")
        print("📝 Agora você pode usar múltiplas imagens no conteúdo dos artigos.")
    else:
        print("\n💥 Falha na migração!")
