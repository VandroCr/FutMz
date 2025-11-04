# 🔧 Criar Admin no Render - Guia Rápido

## ⚠️ Problema

Você está recebendo erro **401 "Username ou senha incorretos"** porque o banco de dados do Render está vazio. O usuário admin ainda não foi criado.

## ✅ Solução: Usar o Endpoint `/api/setup`

O endpoint `/api/setup` cria automaticamente o admin e os artigos no banco de dados do Render.

---

## 📋 Passo a Passo no Swagger UI

### 1️⃣ Acesse o Swagger do Render

No navegador, vá para:
```
https://futmz.onrender.com/docs
```

### 2️⃣ Encontre o Endpoint `/api/setup`

1. **Procure pela seção "Rotas Gerais"** (ou role a página para cima)
2. **Encontre:** `POST /api/setup`
3. **Clique para expandir** (se estiver fechado)

### 3️⃣ Executar o Setup

1. **Clique em "Try it out"**

2. **Clique em "Execute"** (não precisa preencher nada, o endpoint não precisa de body)

3. **Aguarde a resposta:**
   
   **Se for a primeira vez:**
   ```json
   {
     "message": "Setup concluído com sucesso!",
     "admin": {
       "username": "admin",
       "email": "admin@futmz.com",
       "password": "admin123"
     },
     "articles_created": 3,
     "note": "⚠️ Guarde estas credenciais!"
   }
   ```
   
   **Se o admin já existe:**
   ```json
   {
     "message": "Admin já existe",
     "username": "admin",
     "email": "admin@futmz.com"
   }
   ```

### 4️⃣ Agora Você Pode Fazer Login! ✅

1. **Vá para:** `POST /api/users/login`
2. **Clique em "Try it out"**
3. **Preencha:**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. **Clique em "Execute"**
5. **Copie o `access_token`** da resposta

---

## 🔧 Via cURL (Alternativa)

Se preferir usar o terminal:

```bash
# Criar admin e artigos
curl -X POST https://futmz.onrender.com/api/setup

# Depois fazer login
curl -X POST "https://futmz.onrender.com/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

---

## ✅ Verificar se Funcionou

Depois de executar o `/api/setup`, teste se os artigos foram criados:

```
GET https://futmz.onrender.com/api/articles
```

Deve retornar uma lista de artigos ao invés de `[]`.

---

## 🎯 Resumo Rápido

1. Acesse: `https://futmz.onrender.com/docs`
2. Encontre: `POST /api/setup`
3. Clique: "Try it out" → "Execute"
4. Agora faça login normalmente com `admin` / `admin123`

**Pronto! Você pode publicar artigos agora!** 🎉
