# Backend FutMz - API REST

API REST desenvolvida com FastAPI para gerenciamento de artigos, usuários, comentários e favoritos.

## 🚀 Início Rápido

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Execute o servidor:
```bash
python main.py
```

3. Acesse a documentação interativa em: `http://localhost:8000/docs`

## 📋 Requisitos

- Python 3.8+
- pip
- SQLite (incluído no Python)

## 🏗️ Estrutura

```
backend/
├── main.py              # Aplicação principal
├── database.py          # Configuração do banco de dados
├── models.py            # Modelos de dados (SQLAlchemy)
├── schemas.py           # Schemas de validação (Pydantic)
├── auth.py              # Autenticação JWT
├── dependencies.py      # Dependências do FastAPI
├── routers/             # Endpoints organizados
│   ├── auth.py         # Autenticação
│   ├── articles.py     # Artigos
│   ├── comments.py     # Comentários
│   ├── favorites.py    # Favoritos
│   └── users.py        # Usuários
└── requirements.txt     # Dependências Python
```

## 🔐 Autenticação

A API utiliza autenticação JWT (JSON Web Tokens).

### Como obter um token:

1. Registre um novo usuário em `/api/users/register`
2. Faça login em `/api/users/login`
3. Use o token retornado no header `Authorization: Bearer <token>`

### Exemplo de uso:

```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "senha123"}'
```

## 📚 Endpoints Principais

### Autenticação
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Fazer login
- `GET /api/users/me` - Obter dados do usuário atual

### Artigos
- `GET /api/articles` - Listar artigos (paginado)
- `GET /api/articles/{id}` - Obter artigo por ID
- `GET /api/articles/featured` - Artigos em destaque
- `POST /api/articles` - Criar artigo (admin apenas)
- `PUT /api/articles/{id}` - Atualizar artigo (admin apenas)
- `DELETE /api/articles/{id}` - Deletar artigo (admin apenas)

### Comentários
- `GET /api/articles/{id}/comments` - Listar comentários
- `POST /api/comments` - Criar comentário (autenticado)
- `DELETE /api/comments/{id}` - Deletar comentário

### Favoritos
- `GET /api/favorites` - Listar favoritos do usuário
- `POST /api/favorites` - Adicionar favorito
- `DELETE /api/favorites/{article_id}` - Remover favorito
- `GET /api/favorites/check/{article_id}` - Verificar se é favorito

## 🗄️ Banco de Dados

O banco SQLite será criado automaticamente na pasta `data/` na primeira execução.

### Modelos de Dados

- **User**: Usuários do sistema
- **Article**: Artigos da revista
- **Comment**: Comentários nos artigos
- **Favorite**: Favoritos dos usuários

## 🔧 Variáveis de Ambiente

Para produção, configure:

```bash
export SECRET_KEY="sua-chave-secreta-aqui"
```

## 🧪 Testando a API

Use a documentação interativa do Swagger em `/docs` ou teste com curl:

```bash
# Criar usuário
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "senha123",
    "full_name": "Usuário Teste"
  }'

# Login
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "senha123"}'

# Listar artigos
curl http://localhost:8000/api/articles

# Obter artigo (requer autenticação para interagir)
curl http://localhost:8000/api/articles/1
```

## 🛡️ Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT expiram em 7 dias
- Rotas admin requerem permissão especial
- Validação de dados com Pydantic

## 🐛 Debugging

Para ver logs detalhados:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📝 Notas

- O banco SQLite é criado automaticamente
- A primeira execução pode demorar um pouco
- Use a documentação em `/docs` para explorar todos os endpoints



