# 🔧 Solução: Erro 403 Forbidden no Upload de Imagem

## ⚠️ Problema

Você está recebendo erro **403 Forbidden** ao tentar fazer upload:
```
POST /api/upload-image HTTP/1.1" 403 Forbidden
```

Isso acontece porque o endpoint `/api/upload-image` **requer autenticação de admin** e você não está autenticado ou não autorizou corretamente no Swagger.

---

## ✅ Solução Passo a Passo

### 1️⃣ Verificar se o Admin Existe

Primeiro, certifique-se de que o admin foi criado:

1. No Swagger: `https://futmz.onrender.com/docs`
2. Procure: `POST /api/setup`
3. Clique: "Try it out" → "Execute"
4. Se retornar sucesso, o admin foi criado ✅

Se retornar erro, siga o guia `CRIAR_ADMIN_RENDER.md` primeiro.

---

### 2️⃣ Fazer Login

1. **Na seção "Autenticação"**, encontre: `POST /api/users/login`
2. **Clique em "Try it out"**
3. **Preencha o body:**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. **Clique em "Execute"**
5. **Copie o `access_token` completo** da resposta

---

### 3️⃣ Autorizar no Swagger (IMPORTANTE!)

Este passo é **ESSENCIAL** e muitas vezes esquecido:

1. **Procure pelo botão verde "Authorize"** no topo da página do Swagger
   
   ⚠️ **CUIDADO:** Pode estar no canto superior direito, às vezes é pequeno!

2. **Clique no botão "Authorize"**

3. **No popup que abrir:**
   - No campo "Value", **cole o token completo** que você copiou:
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - **NÃO** adicione "Bearer" antes do token, apenas cole o token

4. **Clique no botão "Authorize"** dentro do popup

5. **Clique em "Close"** para fechar o popup

✅ **Agora você verá um cadeado 🔒 ao lado dos endpoints protegidos!**

---

### 4️⃣ Verificar se Está Autorizado

Depois de autorizar, você deve ver:
- Um **cadeado 🔒** ao lado de `POST /api/upload-image`
- O botão "Authorize" deve estar com um check ✅ ou mostrar "Authorized"

Se não aparecer, **repita o passo 3**!

---

### 5️⃣ Agora Fazer Upload

1. **Na seção "Artigos"**, encontre: `POST /api/upload-image`
2. **Clique em "Try it out"**
3. **Clique em "Choose File"** e selecione uma imagem
4. **Clique em "Execute"**
5. **Deve funcionar agora!** ✅

---

## 🔍 Verificações Adicionais

### Verificar se o Token Está Válido

O token JWT expira em 7 dias. Se você fez login há muito tempo, pode precisar fazer login novamente.

### Verificar se o Usuário é Admin

O endpoint verifica se `current_user.is_admin == True`. Certifique-se de usar o usuário **admin**, não um usuário normal.

Para verificar:
1. Faça login
2. Use: `GET /api/users/me` (precisa autorizar)
3. Verifique se a resposta tem `"is_admin": true`

---

## 🎯 Checklist Rápido

Antes de fazer upload, certifique-se:

- [ ] Executei `/api/setup` (admin existe)
- [ ] Fiz login com `admin` / `admin123`
- [ ] Copiei o `access_token` completo
- [ ] Cliquei no botão "Authorize" no Swagger
- [ ] Colei o token no campo "Value"
- [ ] Cliquei em "Authorize" dentro do popup
- [ ] Fechei o popup
- [ ] Vejo o cadeado 🔒 ao lado do endpoint
- [ ] Agora posso fazer upload

---

## ⚠️ Erros Comuns

### Erro: "Token inválido ou expirado"
- **Solução:** Faça login novamente e copie o novo token

### Erro: "Permissão negada. Apenas administradores"
- **Causa:** Você está usando um usuário que não é admin
- **Solução:** Use `admin` / `admin123` ou crie um novo admin

### Erro: Continua dando 403 mesmo depois de autorizar
- **Causa:** O token não foi colado corretamente ou o popup não foi fechado
- **Solução:** 
  1. Feche todas as abas do Swagger
  2. Abra novamente: `https://futmz.onrender.com/docs`
  3. Faça login novamente
  4. Autorize novamente
  5. Tente o upload

---

## 📋 Resumo Rápido

1. Execute `/api/setup` (se necessário)
2. Login: `POST /api/users/login` com `admin` / `admin123`
3. **Copiar token**
4. **Clicar "Authorize"** → Colar token → Autorizar → Fechar
5. Verificar cadeado 🔒
6. Upload: `POST /api/upload-image` → Escolher arquivo → Execute

**Agora deve funcionar!** ✅
