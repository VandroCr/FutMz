# FutMz - Revista Digital de Futebol

Aplicativo móvel e backend para revista digital sobre futebol moçambicano e internacional.

## 📱 Tecnologias

### Mobile (React Native + Expo)
- React Native 0.81.5
- Expo 54.0.20
- React Navigation
- AsyncStorage para armazenamento local

### Backend (Python + FastAPI)
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- SQLite
- JWT Authentication
- Pydantic para validação

## 🚀 Como Executar

### Backend

1. Navegue até o diretório backend:
```bash
cd backend
```

2. Crie um ambiente virtual (recomendado):
```bash
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Execute o servidor:
```bash
python main.py
```

O servidor estará disponível em: `http://localhost:8000`

Documentação interativa: `http://localhost:8000/docs`

### Mobile

1. Navegue até o diretório FutMz:
```bash
cd FutMz
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o aplicativo:
```bash
npm start
```

4. Escaneie o QR code com o Expo Go ou pressione:
- `a` para Android
- `i` para iOS
- `w` para Web

## 📋 Funcionalidades

### Usuários
- ✅ Cadastro e Login com JWT
- ✅ Gerenciamento de sessão
- ✅ Perfil de usuário

### Artigos
- ✅ Listagem de artigos
- ✅ Visualização de detalhes
- ✅ Busca e filtros
- ✅ Categorias
- ✅ Suporte a imagens, vídeos e áudios
- ✅ Contador de visualizações

### Interação
- ✅ Comentários nos artigos
- ✅ Sistema de favoritos
- ✅ Autenticação necessária para interagir

### Admin
- ✅ CRUD completo de artigos
- ✅ Publicar/despublicar artigos
- ✅ Marcar como destaque

## 🗂️ Estrutura do Projeto

```
/
├── backend/
│   ├── main.py              # Aplicação FastAPI
│   ├── database.py          # Configuração do banco
│   ├── models.py            # Modelos SQLAlchemy
│   ├── schemas.py           # Schemas Pydantic
│   ├── auth.py              # Autenticação JWT
│   ├── dependencies.py      # Dependências FastAPI
│   ├── routers/             # Endpoints
│   │   ├── auth.py
│   │   ├── articles.py
│   │   ├── comments.py
│   │   ├── favorites.py
│   │   └── users.py
│   └── requirements.txt
│
└── FutMz/
    ├── App.js               # Componente principal
    ├── config.js            # Configurações
    ├── screens/             # Telas do app
    │   ├── HomeScreen.js
    │   ├── ArticleDetailScreen.js
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   └── FavoritesScreen.js
    └── package.json
```

## 🔑 Endpoints da API

### Autenticação
- `POST /api/users/register` - Registrar usuário
- `POST /api/users/login` - Login
- `GET /api/users/me` - Informações do usuário atual

### Artigos
- `GET /api/articles` - Listar artigos
- `GET /api/articles/featured` - Artigos em destaque
- `GET /api/articles/{id}` - Detalhes do artigo
- `POST /api/articles` - Criar artigo (admin)
- `PUT /api/articles/{id}` - Atualizar artigo (admin)
- `DELETE /api/articles/{id}` - Deletar artigo (admin)

### Comentários
- `GET /api/articles/{id}/comments` - Listar comentários
- `POST /api/comments` - Adicionar comentário
- `DELETE /api/comments/{id}` - Deletar comentário

### Favoritos
- `GET /api/favorites` - Listar favoritos
- `POST /api/favorites` - Adicionar favorito
- `DELETE /api/favorites/{article_id}` - Remover favorito
- `GET /api/favorites/check/{article_id}` - Verificar se é favorito

## 🔐 Segurança

- Senhas são hasheadas com bcrypt
- JWT tokens para autenticação
- Proteção de rotas admin
- Validação de dados com Pydantic

## 📝 Notas

- Configure a URL da API em `FutMz/config.js`
- Para desenvolvimento local, use `http://localhost:8000`
- Para Android, use `http://10.0.2.2:8000` (emulador) ou o IP da sua máquina
- Para iOS, use o IP da sua máquina na rede local

## 🚧 Próximos Passos

- [ ] Upload de imagens
- [ ] Notificações push
- [ ] Modo offline
- [ ] Compartilhamento de artigos
- [ ] Estatísticas de leitura
- [ ] Edições da revista
- [ ] Assinaturas premium



