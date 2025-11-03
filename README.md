# FutMz - Revista Digital de Futebol

Revista digital interativa sobre futebol moçambicano e internacional, com artigos, vídeos, entrevistas e notícias atualizadas.

## 🎯 Sobre o Projeto

FutMz é uma plataforma completa para leitura de conteúdo sobre futebol, desenvolvida com React Native (mobile) e FastAPI (backend).

### Características Principais

- 📱 Aplicativo mobile multiplataforma (iOS e Android)
- 🔐 Sistema de autenticação JWT
- 📰 Artigos com suporte a mídia rica (imagens, vídeos, áudios)
- 💬 Sistema de comentários
- ⭐ Favoritos
- 🔍 Busca e filtros
- 👤 Perfis de usuário
- 🛡️ Painel administrativo

## 🏗️ Arquitetura

### Backend
- **Framework**: FastAPI (Python)
- **Banco de Dados**: SQLite com SQLAlchemy ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Pydantic

### Frontend
- **Framework**: React Native com Expo
- **Navegação**: React Navigation
- **Armazenamento**: AsyncStorage

## 📦 Instalação e Execução

### Pré-requisitos

- Python 3.8+
- Node.js 14+
- npm ou yarn
- Expo CLI

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Servidor rodando em: `http://localhost:8000`

### Mobile

```bash
cd FutMz
npm install
npm start
```

Use Expo Go no seu dispositivo ou emulador.

## 📂 Estrutura

```
/
├── backend/          # API FastAPI
├── FutMz/           # App React Native
└── README.md
```

Veja detalhes em cada diretório.

## 🚀 Funcionalidades Implementadas

✅ Autenticação (registro, login, JWT)  
✅ CRUD de artigos  
✅ Comentários  
✅ Favoritos  
✅ Busca e filtros  
✅ Perfil de usuário  
✅ Interface administrativa  

## 📝 Licença

Este projeto é de código aberto.

## 👥 Contribuidores

Desenvolvido para a plataforma FutMz.

## 📞 Suporte

Para questões ou sugestões, abra uma issue no repositório.

## 📤 Publicação e Deploy

Este projeto está disponível em: https://github.com/VandroCr/FutMz.git

### 📋 Guias de Deploy

Para publicar e hospedar o projeto:

1. **INICIO_RAPIDO_DEPLOY.md** - ⭐ **COMECE AQUI!** Deploy completo em 30 minutos
2. **PUBLICAR_NO_GITHUB.md** - Publicar código no GitHub
3. **GUIA_DEPLOY_COMPLETO.md** - Guia detalhado de todas as opções
4. **CONFIGURAR_POSTGRESQL.md** - Configurar banco PostgreSQL (opcional)
5. **DEPLOY_EXPO.bat** - Script para publicar no Expo
6. **PUBLICAR_GITHUB.bat** - Script para publicar no GitHub

### 🚀 Deploy Rápido

Siga o arquivo **INICIO_RAPIDO_DEPLOY.md** para ter seu app online em 30 minutos!



