# 📋 Rotas da API FutMz - Resumo

**Base URL:** `https://futmz.onrender.com`

---

## 📌 Rotas Gerais

```
GET  /
GET  /api/health
POST /api/setup
```

---

## 🔐 Autenticação

```
POST /api/users/register
POST /api/users/login
GET  /api/users/me (requer auth)
```

---

## 📰 Artigos

```
GET    /api/articles
GET    /api/articles/{article_id}
GET    /api/articles/featured
POST   /api/articles (requer admin)
PUT    /api/articles/{article_id} (requer admin)
DELETE /api/articles/{article_id} (requer admin)
```

---

## 📸 Upload

```
POST /api/upload-image (requer admin)
POST /api/upload-video (requer admin)
```

---

## 💬 Comentários

```
GET    /api/articles/{article_id}/comments
POST   /api/comments (requer auth)
DELETE /api/comments/{comment_id} (requer auth ou admin)
```

---

## ⭐ Favoritos

```
GET    /api/favorites (requer auth)
POST   /api/favorites (requer auth)
DELETE /api/favorites/{article_id} (requer auth)
GET    /api/favorites/check/{article_id} (requer auth)
```

---

## ⚽ Equipas

```
GET    /api/teams/
GET    /api/teams/{team_id}
POST   /api/teams/ (requer admin)
PUT    /api/teams/{team_id} (requer admin)
DELETE /api/teams/{team_id} (requer admin)
```

---

**Total:** 27 rotas

