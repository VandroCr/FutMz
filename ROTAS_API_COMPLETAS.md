# 🚀 Rotas da API FutMz

**Base URL:** `https://futmz.onrender.com`  
**Documentação:** `https://futmz.onrender.com/docs`  
**Swagger UI:** `https://futmz.onrender.com/docs`  
**ReDoc:** `https://futmz.onrender.com/redoc`

---

## 📌 Rotas Gerais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Mensagem de boas-vindas |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/setup` | Criar admin e artigos de exemplo |

---

## 🔐 Autenticação

### Registrar Usuário
```
POST /api/users/register
```

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "full_name": "string"
}
```

### Login
```
POST /api/users/login
```

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### Obter Usuário Atual
```
GET /api/users/me
```
**Autenticação:** Requerida

---

## 📰 Artigos

### Listar Artigos
```
GET /api/articles
```

**Query Parameters:**
- `skip` (int, default: 0) - Número de artigos a pular
- `limit` (int, default: 20, max: 100) - Número de artigos por página
- `category` (string, optional) - Filtrar por categoria
- `published` (bool, default: true) - Filtrar apenas publicados
- `featured` (bool, optional) - Filtrar por destaque
- `search` (string, optional) - Buscar nos títulos

**Exemplo:**
```
GET /api/articles?limit=10&category=Nacional&featured=true
```

### Obter Artigo por ID
```
GET /api/articles/{article_id}
```

### Artigos em Destaque
```
GET /api/articles/featured
```

**Query Parameters:**
- `limit` (int, default: 5, max: 20)

### Criar Artigo
```
POST /api/articles
```
**Autenticação:** Admin apenas

**Body:**
```json
{
  "title": "string",
  "slug": "string (opcional)",
  "content": "string",
  "excerpt": "string",
  "category": "string",
  "image_url": "string (opcional)",
  "video_url": "string (opcional)",
  "audio_url": "string (opcional)",
  "content_images": ["string"] (opcional),
  "tags": "string (opcional)",
  "featured": boolean,
  "published": boolean
}
```

### Atualizar Artigo
```
PUT /api/articles/{article_id}
```
**Autenticação:** Admin apenas

### Deletar Artigo
```
DELETE /api/articles/{article_id}
```
**Autenticação:** Admin apenas

---

## 📸 Upload de Arquivos

### Upload de Imagem
```
POST /api/upload-image
```
**Autenticação:** Admin apenas

**Body:** `multipart/form-data`
- `file`: arquivo de imagem

**Response:**
```json
{
  "image_url": "/uploads/uuid.jpg"
}
```

### Upload de Vídeo
```
POST /api/upload-video
```
**Autenticação:** Admin apenas

**Body:** `multipart/form-data`
- `file`: arquivo de vídeo

**Response:**
```json
{
  "video_url": "/uploads/uuid.mp4"
}
```

---

## 💬 Comentários

### Listar Comentários de um Artigo
```
GET /api/articles/{article_id}/comments
```

### Adicionar Comentário
```
POST /api/comments
```
**Autenticação:** Requerida

**Body:**
```json
{
  "article_id": integer,
  "content": "string"
}
```

### Deletar Comentário
```
DELETE /api/comments/{comment_id}
```
**Autenticação:** Próprio comentário ou Admin

---

## ⭐ Favoritos

### Listar Favoritos do Usuário
```
GET /api/favorites
```
**Autenticação:** Requerida

### Adicionar Favorito
```
POST /api/favorites
```
**Autenticação:** Requerida

**Body:**
```json
{
  "article_id": integer
}
```

### Remover Favorito
```
DELETE /api/favorites/{article_id}
```
**Autenticação:** Requerida

### Verificar se Artigo está nos Favoritos
```
GET /api/favorites/check/{article_id}
```
**Autenticação:** Requerida

**Response:**
```json
{
  "is_favorite": boolean
}
```

---

## ⚽ Equipas (Teams)

### Listar Equipas
```
GET /api/teams/
```

**Query Parameters:**
- `skip` (int, default: 0)
- `limit` (int, default: 100)

### Obter Equipa por ID
```
GET /api/teams/{team_id}
```

### Criar Equipa
```
POST /api/teams/
```
**Autenticação:** Admin apenas

**Body:**
```json
{
  "name": "string",
  "logo_url": "string (opcional)",
  "country": "string (opcional)"
}
```

### Atualizar Equipa
```
PUT /api/teams/{team_id}
```
**Autenticação:** Admin apenas

### Deletar Equipa
```
DELETE /api/teams/{team_id}
```
**Autenticação:** Admin apenas

---

## 🔒 Autenticação nas Requisições

Para rotas que requerem autenticação, adicione o header:

```
Authorization: Bearer {access_token}
```

---

## 📝 Códigos de Status HTTP

- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `204 No Content` - Sucesso sem conteúdo
- `400 Bad Request` - Erro na requisição
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

---

## 🎯 Exemplos de Uso

### Obter todos os artigos publicados
```bash
curl https://futmz.onrender.com/api/articles
```

### Obter artigos de uma categoria
```bash
curl "https://futmz.onrender.com/api/articles?category=Nacional"
```

### Buscar artigos
```bash
curl "https://futmz.onrender.com/api/articles?search=mambas"
```

### Fazer login
```bash
curl -X POST https://futmz.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Criar artigo (com auth)
```bash
curl -X POST https://futmz.onrender.com/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "Meu Artigo",
    "content": "Conteúdo do artigo",
    "category": "Nacional",
    "published": true,
    "featured": false
  }'
```

### Upload de imagem (com auth)
```bash
curl -X POST https://futmz.onrender.com/api/upload-image \
  -H "Authorization: Bearer {token}" \
  -F "file=@imagem.jpg"
```

---

## 📚 Recursos Adicionais

- **Documentação Interativa:** https://futmz.onrender.com/docs
- **ReDoc:** https://futmz.onrender.com/redoc
- **Schema JSON:** https://futmz.onrender.com/openapi.json

---

**Versão:** 1.0.0  
**Última Atualização:** 2025-01-XX

