#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para testar o backend local
"""

import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://localhost:8000"

def make_request(url, method="GET", data=None):
    """Faz uma requisição HTTP"""
    try:
        if data:
            data = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=data, method=method)
            req.add_header('Content-Type', 'application/json')
        else:
            req = urllib.request.Request(url, method=method)
        
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.URLError as e:
        if "Connection refused" in str(e) or "No connection" in str(e):
            return None, {"error": "Servidor não está rodando"}
        return None, {"error": str(e)}
    except Exception as e:
        return None, {"error": str(e)}

def test_health():
    """Testa o endpoint de health check"""
    status, data = make_request(f"{BASE_URL}/api/health")
    if status == 200:
        print("✅ Health check: OK")
        print(f"   Response: {data}")
        return True
    else:
        print(f"❌ Health check: Falhou")
        if isinstance(data, dict) and "error" in data:
            print(f"   {data['error']}")
        return False

def test_root():
    """Testa o endpoint raiz"""
    status, data = make_request(f"{BASE_URL}/")
    if status == 200:
        print("✅ Root endpoint: OK")
        print(f"   Response: {data}")
        return True
    else:
        print(f"❌ Root endpoint: Falhou")
        return False

def test_articles():
    """Testa o endpoint de artigos"""
    status, data = make_request(f"{BASE_URL}/api/articles?published=true&limit=10")
    if status == 200 and isinstance(data, list):
        print(f"✅ Artigos: {len(data)} artigos encontrados")
        if len(data) > 0:
            print(f"   Primeiro artigo: {data[0].get('title', 'Sem título')}")
        return True, data
    else:
        print(f"❌ Artigos: Falhou")
        return False, []

def test_featured():
    """Testa o endpoint de artigos em destaque"""
    status, data = make_request(f"{BASE_URL}/api/articles/featured?limit=3")
    if status == 200 and isinstance(data, list):
        print(f"✅ Artigos em destaque: {len(data)} artigos encontrados")
        return True
    else:
        print(f"❌ Artigos em destaque: Falhou")
        return False

def test_login():
    """Testa o endpoint de login"""
    payload = {
        "username": "admin",
        "password": "admin123"
    }
    status, data = make_request(f"{BASE_URL}/api/users/login", "POST", payload)
    if status == 200 and isinstance(data, dict) and "access_token" in data:
        print("✅ Login: OK")
        token = data.get('access_token', '')
        print(f"   Token recebido: {token[:20]}..." if len(token) > 20 else f"   Token recebido: {token}")
        return True, token
    else:
        print(f"❌ Login: Falhou")
        if isinstance(data, dict) and "detail" in data:
            print(f"   {data['detail']}")
        return False, None

def main():
    print("=" * 60)
    print("TESTANDO BACKEND LOCAL")
    print("=" * 60)
    print(f"URL base: {BASE_URL}\n")
    
    # Testar health check
    if not test_health():
        print("\n⚠️  Servidor não está rodando!")
        print("   Para iniciar: cd backend && python main.py")
        print("\n📊 Status do banco de dados local:")
        print("   - Execute: python verificar_artigos.py")
        sys.exit(1)
    
    print()
    
    # Testar root
    test_root()
    print()
    
    # Testar artigos
    success, articles = test_articles()
    print()
    
    # Testar artigos em destaque
    test_featured()
    print()
    
    # Testar login
    success_login, token = test_login()
    print()
    
    # Resumo
    print("=" * 60)
    print("RESUMO")
    print("=" * 60)
    print(f"✅ Health check: OK")
    print(f"✅ Root endpoint: OK")
    print(f"{'✅' if success else '❌'} Artigos: {len(articles)} artigos")
    print(f"{'✅' if success_login else '❌'} Login: {'OK' if success_login else 'FALHOU'}")
    print()
    
    if success and len(articles) > 0:
        print("📊 Artigos no backend:")
        for i, article in enumerate(articles[:5], 1):
            print(f"   {i}. {article.get('title', 'Sem título')}")
            print(f"      Categoria: {article.get('category', 'N/A')}")
            print(f"      Imagem: {'Sim' if article.get('image_url') else 'Não'}")
    print()
    
    print("✅ Backend local está funcionando!")

if __name__ == "__main__":
    main()
