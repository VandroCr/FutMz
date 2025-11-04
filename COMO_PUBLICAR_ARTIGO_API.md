# 📰 Como Publicar um Artigo pela API

## 🎯 Passo a Passo Completo

### 1️⃣ Fazer Login para Obter o Token

1. **Acesse o Swagger UI:**
   - Local: `http://localhost:8000/docs`
   - Produção: `https://futmz.onrender.com/docs`

2. **Expandir seção "Autenticação"**

3. **Clicar em `POST /api/users/login`**

4. **Clicar em "Try it out"**

5. **Preencher o body:**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

6. **Clicar em "Execute"**

7. **Copiar o `access_token` da resposta:**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "token_type": "bearer"
   }
   ```

---

### 2️⃣ Autorizar no Swagger

1. **Clicar no botão verde "Authorize"** (no topo da página)

2. **No campo "Value", colar o token completo:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Clicar em "Authorize"**

4. **Clicar em "Close"**

✅ Agora você está autenticado! Todos os endpoints protegidos funcionarão.

---

### 3️⃣ (Opcional) Fazer Upload de Imagem

1. **Expandir seção "Artigos"**

2. **Clicar em `POST /api/upload-image`**

3. **Clicar em "Try it out"**

4. **Clicar em "Choose File" e selecionar uma imagem**

5. **Clicar em "Execute"**

6. **Copiar o `image_url` da resposta:**
   ```json
   {
     "image_url": "/uploads/0a710882-1291-44af-aed4-70457ad8a086.jpg"
   }
   ```

**Importante:** Para produção (Render), a URL completa será:
```
https://futmz.onrender.com/uploads/0a710882-1291-44af-aed4-70457ad8a086.jpg
```

---

### 4️⃣ Publicar o Artigo

1. **Na seção "Artigos", clicar em `POST /api/articles`**

2. **Clicar em "Try it out"**

3. **Preencher o body com os dados do artigo:**

   ```json
   {
     "title": "Meu Novo Artigo",
     "content": "Este é o conteúdo completo do artigo. Pode ter várias linhas e parágrafos.\n\nSegundo parágrafo aqui.",
     "excerpt": "Resumo breve do artigo (opcional)",
     "category": "Nacional",
     "image_url": "/uploads/0a710882-1291-44af-aed4-70457ad8a086.jpg",
     "tags": "Futebol, Moçambique, Liga",
     "featured": true,
     "published": true
   }
   ```

   **Campos obrigatórios:**
   - `title`: Título do artigo
   - `content`: Conteúdo completo

   **Campos opcionais:**
   - `excerpt`: Resumo (se não informado, usa primeiros 200 caracteres do content)
   - `slug`: URL amigável (gerado automaticamente se não informado)
   - `category`: Categoria (ex: "Nacional", "Internacional", "Liga Moçambicana")
   - `image_url`: URL da imagem principal
   - `video_url`: URL do vídeo (se houver)
   - `audio_url`: URL do áudio (se houver)
   - `content_images`: Array de URLs de imagens adicionais
   - `tags`: Tags separadas por vírgula
   - `featured`: `true` se quiser destacar na home
   - `published`: `true` para publicar imediatamente, `false` para salvar como rascunho

4. **Clicar em "Execute"**

5. **Verificar a resposta:**
   - Status `201 Created` = Sucesso! ✅
   - O artigo criado será retornado com todos os detalhes

---

## 📝 Exemplo Completo de Body

```json
{
  "title": "🏟️ MASSIFICAÇÃO DO FUTEBOL NA ZAMBEZIA GANHA REFORÇO! ⚽",
  "content": "Dando seguimento à visita de trabalho à Província da Zambezia, a delegação liderada pelo Presidente da Federação Moçambicana de Futebol, Feizal Sidat, procedeu à entrega de 1200 bolas de futebol a 22 associações distritais da província.\n\nEste importante gesto visa massificar ainda mais o futebol na região, fornecendo material desportivo essencial para o desenvolvimento das categorias de base e o crescimento do futebol local.\n\nAs associações beneficiadas agradeceram a iniciativa e se comprometeram a utilizar adequadamente o material recebido para a promoção e desenvolvimento do futebol nas suas respectivas áreas de atuação.",
  "excerpt": "Dando seguimento à visita de trabalho à Província da Zambezia, a delegação liderada pelo Presidente da Federação Moçambicana de Futebol, Feizal Sidat, procedeu à entrega de 1200 bolas de futebol a 22 associações distritais da província.",
  "category": "Nacional",
  "image_url": "https://futmz.onrender.com/uploads/0a710882-1291-44af-aed4-70457ad8a086.jpg",
  "tags": "FMF, Zambezia, Futebol Moçambicano",
  "featured": true,
  "published": true
}
```

---

## 🔧 Via cURL (Terminal)

### 1. Fazer Login:
```bash
curl -X POST "http://localhost:8000/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Copiar o `access_token` da resposta**

### 2. Publicar Artigo:
```bash
curl -X POST "http://localhost:8000/api/articles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Meu Novo Artigo",
    "content": "Conteúdo do artigo aqui",
    "category": "Nacional",
    "published": true,
    "featured": false
  }'
```

---

## ⚠️ Erros Comuns

### 401 Unauthorized
- **Causa:** Token inválido ou expirado
- **Solução:** Faça login novamente e copie o novo token

### 403 Forbidden
- **Causa:** Usuário não é admin
- **Solução:** Use credenciais de admin (`admin` / `admin123`)

### 400 Bad Request
- **Causa:** Dados inválidos (faltando título ou conteúdo)
- **Solução:** Verifique se `title` e `content` estão preenchidos

### 422 Validation Error
- **Causa:** Formato de dados incorreto
- **Solução:** Verifique o formato JSON e os tipos de dados

---

## ✅ Verificar se Funcionou

Depois de publicar, teste se o artigo aparece:

```bash
# Listar todos os artigos
GET http://localhost:8000/api/articles

# Ver artigo específico
GET http://localhost:8000/api/articles/{id}
```

---

## 🎯 Resumo Rápido

1. Login → Copiar token
2. Authorize → Colar token
3. POST /api/articles → Preencher dados → Execute

**Pronto! Artigo publicado!** 🎉
