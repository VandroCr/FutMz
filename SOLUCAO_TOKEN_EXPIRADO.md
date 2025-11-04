# 🔧 Solução: Token Inválido ou Expirado

## ⚠️ Problema

Você está recebendo erro **401 "Token inválido ou expirado"** ao tentar criar um artigo.

Isso acontece porque:
- O token JWT expirou (tokens expiram após 7 dias)
- Ou você fechou o navegador/sessão do Swagger
- Ou o token não foi autorizado corretamente

---

## ✅ Solução Rápida (2 minutos)

### 1️⃣ Fazer Login Novamente

1. **No Swagger:** `https://futmz.onrender.com/docs`
2. **Seção "Autenticação"** → `POST /api/users/login`
3. **"Try it out"**
4. **Preencha:**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
5. **"Execute"**
6. **Copie o `access_token` completo** da resposta

---

### 2️⃣ Autorizar Novamente (MUITO IMPORTANTE!)

**Este passo é ESSENCIAL e muitas vezes esquecido!**

1. **Procure o botão verde "Authorize"** no topo do Swagger
   - Geralmente no canto superior direito
   - Às vezes é pequeno, procure bem!

2. **Clique no botão "Authorize"**

3. **No popup:**
   - Se já tem um token antigo, **LIMPE o campo "Value"**
   - **Cole o novo token** que você acabou de copiar
   - **NÃO** adicione "Bearer", apenas o token

4. **Clique em "Authorize"** dentro do popup

5. **Clique em "Close"** para fechar

6. **Verifique:** Deve aparecer um **cadeado 🔒** ao lado dos endpoints protegidos

---

### 3️⃣ Tentar Novamente

Agora tente criar o artigo novamente:
1. `POST /api/articles`
2. "Try it out"
3. Preencha os dados
4. "Execute"

**Deve funcionar agora!** ✅

---

## 🔍 Por Que Isso Acontece?

### Tokens JWT Expiraram

Os tokens JWT têm validade de **7 dias**. Depois disso, você precisa fazer login novamente.

### Sessão do Navegador

Se você:
- Fechou o navegador
- Limpou o cache
- Abriu em outra aba/janela
- Usou modo anônimo

O Swagger não lembra do token. Precisa autorizar novamente.

### Token Não Autorizado

Mesmo depois de fazer login, você **DEVE** clicar no botão "Authorize" e colar o token. Só fazer login não é suficiente!

---

## 🎯 Checklist Rápido

Antes de criar artigo, certifique-se:

- [ ] Fiz login: `POST /api/users/login` com `admin` / `admin123`
- [ ] Copiei o `access_token` da resposta
- [ ] **Cliquei no botão "Authorize"** no Swagger
- [ ] **Limpei o campo antigo** (se havia)
- [ ] **Colei o novo token** no campo "Value"
- [ ] Cliquei em "Authorize" dentro do popup
- [ ] Fechei o popup
- [ ] Vejo o **cadeado 🔒** ao lado de `POST /api/articles`
- [ ] Agora posso criar o artigo

---

## ⚠️ Dica: Verificar se Está Autorizado

Antes de tentar criar artigo, verifique:

1. Olhe para o endpoint `POST /api/articles`
2. Deve ter um **🔒 cadeado** ao lado dele
3. Se não tem, você NÃO está autorizado

---

## 📋 Resumo Ultra-Rápido

1. **Login:** `POST /api/users/login` → Copiar token
2. **Autorizar:** Botão "Authorize" → Colar token → Autorizar → Fechar
3. **Verificar:** Cadeado 🔒 deve aparecer
4. **Criar:** `POST /api/articles` → Preencher → Execute

---

## 💡 Prevenção

Para evitar isso no futuro:

1. **Sempre autorize** após fazer login
2. **Mantenha o Swagger aberto** (não feche o navegador)
3. Se o token expirar, **faça login novamente** (é rápido, 30 segundos)

---

**Pronto! Agora deve funcionar!** ✅
