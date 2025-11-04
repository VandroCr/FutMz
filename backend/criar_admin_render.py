#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para criar admin no Render via endpoint /api/setup
"""

import urllib.request
import json
import sys

RENDER_API_URL = "https://futmz.onrender.com/api"

def call_setup():
    """Chama o endpoint /api/setup no Render"""
    print("🔧 Criando admin no Render...")
    print(f"   URL: {RENDER_API_URL}/setup\n")
    
    try:
        req = urllib.request.Request(
            f"{RENDER_API_URL}/setup",
            method="POST"
        )
        req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            if response.status == 200:
                print("✅ Admin criado com sucesso!")
                print("\n📋 Credenciais:")
                if 'admin' in data:
                    admin = data['admin']
                    print(f"   Username: {admin.get('username')}")
                    print(f"   Email: {admin.get('email')}")
                    print(f"   Password: {admin.get('password')}")
                
                if 'articles_created' in data:
                    print(f"\n📰 Artigos criados: {data['articles_created']}")
                
                if 'message' in data and 'já existe' in data['message']:
                    print(f"\n⚠️  {data['message']}")
                    if 'username' in data:
                        print(f"   Username existente: {data.get('username')}")
                        print(f"   Email existente: {data.get('email')}")
                
                return True
            else:
                print(f"❌ Erro: {response.status}")
                print(f"   Response: {data}")
                return False
                
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else "{}"
        try:
            error_data = json.loads(error_body)
            print(f"❌ Erro HTTP {e.code}: {error_data}")
        except:
            print(f"❌ Erro HTTP {e.code}: {error_body}")
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("=" * 70)
    print("CRIAR ADMIN NO RENDER")
    print("=" * 70)
    print()
    
    success = call_setup()
    
    print()
    print("=" * 70)
    if success:
        print("✅ Processo concluído!")
        print("\nAgora você pode executar: python exportar_para_render.py")
    else:
        print("❌ Falha ao criar admin")
        print("\nVerifique se o Render está online e deployado corretamente")
    print("=" * 70)

if __name__ == "__main__":
    main()
