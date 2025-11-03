# 🚀 Guia Completo de Deploy - FutMz

Este guia vai te ajudar a:
1. ✅ Publicar o código no GitHub
2. ✅ Hospedar o backend (API) online
3. ✅ Publicar o app no Expo
4. ✅ Disponibilizar link de acesso para o docente

---

## 📦 PARTE 1: Publicar no GitHub

### Opção A: Usando GitHub Desktop (Mais Fácil)

1. **Baixar GitHub Desktop**: https://desktop.github.com/
2. **Instalar e fazer login** na sua conta GitHub
3. **Adicionar repositório local**:
   - Abra GitHub Desktop
   - File → Add Local Repository
   - Selecione a pasta: `C:\Users\vandr\OneDrive\Área de Trabalho\Revista`
4. **Publicar no GitHub**:
   - Clique em "Publish repository"
   - URL: https://github.com/VandroCr/FutMz.git
   - Marque "Keep this code private" (opcional)
   - Clique em "Publish Repository"

### Opção B: Usando Git no Terminal

Se você tiver Git instalado, execute os comandos no arquivo `PUBLICAR_GITHUB.bat` ou manualmente:

```bash
cd "C:\Users\vandr\OneDrive\Área de Trabalho\Revista"
git init
git add .
git commit -m "Initial commit: FutMz App"
git remote add origin https://github.com/VandroCr/FutMz.git
git branch -M main
git push -u origin main
```

---

## ☁️ PARTE 2: Hospedar Backend/API

Você tem várias opções para hospedar sua API FastAPI:

### Opção 1: Render.com (RECOMENDADO - GRÁTIS)

1. **Acesse**: https://render.com
2. **Cadastre-se** com GitHub
3. **Criar novo Web Service**:
   - Connect repository: `VandroCr/FutMz`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Configurar variáveis** (se necessário)
5. **Deploy**: Clique em "Create Web Service"

A URL será algo como: `https://futmz-api.onrender.com`

### Opção 2: Railway.app (GRÁTIS)

1. **Acesse**: https://railway.app
2. **Login com GitHub**
3. **Deploy from GitHub repo**
4. **Configure**:
   - Root Directory: `backend`
   - Start Command: `uvicorn main:app --host 0.0.0.0`
5. **Deploy**

### Opção 3: PythonAnywhere (GRÁTIS)

1. **Acesse**: https://www.pythonanywhere.com
2. **Criar conta gratuita**
3. **Upload do projeto** via console
4. **Configurar web app**

### Opção 4: Heroku (PAGO)

Não recomendado para iniciantes, mas muito robusto.

---

## 📱 PARTE 3: Publicar App no Expo

### 1. Preparar o App

Você precisa atualizar a URL da API no arquivo `config.js`:

```javascript
// FutMz/config.js

import { Platform } from 'react-native';

// IMPORTANTE: Substitua pela URL do seu backend hospedado
const BACKEND_URL = Platform.OS === 'web' 
  ? 'https://seu-backend-hospedado.com' // URL do backend hospedado
  : 'https://seu-backend-hospedado.com'; // Mesma URL para mobile

export const API_URL = `${BACKEND_URL}/api`;
export const SERVER_URL = BACKEND_URL;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@FutMz:auth_token',
};
```

### 2. Fazer Login no Expo

```bash
cd FutMz
npx expo login
```

Use sua conta Expo ou crie uma em https://expo.dev

### 3. Publicar no Expo

```bash
npx expo publish
```

OU usando o novo sistema EAS:

```bash
npx eas build --platform all --profile preview
```

### 4. Obter Link de Acesso

Após publicar, você receberá um link como:

```
exp://exp.host/@seu-usuario/futmz
```

**Link Web**: https://expo.dev/@seu-usuario/futmz

**Para compartilhar com o docente**:
- Web: https://expo.dev/@seu-usuario/futmz
- Mobile: Instale o Expo Go no celular e escaneie o QR code

---

## ⚙️ PARTE 4: Configurações Importantes

### 4.1 Atualizar CORS no Backend

No arquivo `backend/main.py`, certifique-se de que está assim:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, use domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Banco de Dados

**IMPORTANTE**: O SQLite local não funciona online. Você precisa:

#### Opção A: Usar PostgreSQL (Recomendado)

Render.com oferece PostgreSQL gratuito:

1. No dashboard Render → New → PostgreSQL
2. Copie a connection string
3. Atualize `backend/database.py` para usar PostgreSQL

```python
# Install: pip install psycopg2-binary
DATABASE_URL = "postgresql://user:pass@host:5432/dbname"

engine = create_engine(DATABASE_URL)
```

#### Opção B: Continuar com SQLite

Se continuar com SQLite, você precisará fazer upload do arquivo `futmz.db` também. **NÃO RECOMENDADO para produção**.

### 4.3 Uploads de Imagens/Vídeos

Para hospedar arquivos de upload:

#### Opção A: Cloudinary (GRÁTIS)

1. Crie conta em https://cloudinary.com
2. Instale: `pip install cloudinary`
3. Atualize o código de upload

#### Opção B: Render.com Volumes

Adicione Volume no Render para persistir uploads.

---

## 📋 CHECKLIST FINAL

Antes de enviar para o docente, verifique:

- [ ] Código publicado no GitHub
- [ ] Backend hospedado e funcionando
- [ ] URL do backend testada (abra no navegador: `https://seu-backend.com/docs`)
- [ ] Config.js atualizado com URL do backend
- [ ] App publicado no Expo
- [ ] Link do Expo gerado
- [ ] Teste completo no navegador
- [ ] Teste em celular com Expo Go

---

## 🔗 Links Úteis

- **GitHub**: https://github.com/VandroCr/FutMz
- **Expo**: https://expo.dev
- **Render**: https://render.com
- **Railway**: https://railway.app
- **Cloudinary**: https://cloudinary.com

---

## 💡 Dicas

1. **Use Render.com**: Mais fácil, gratuito, e dá deploy automático do GitHub
2. **Teste sempre**: Após cada deploy, teste todas as funcionalidades
3. **Mantenha o código atualizado**: Push no GitHub ativa o redeploy no Render
4. **Documente**: Adicione um README explicando como o app funciona
5. **Crie credenciais de admin**: Providencie login de admin para o docente testar

---

## 🆘 Resolução de Problemas

### Erro de CORS
- Adicione o domínio do Expo nas origins permitidas

### Backend não conecta
- Verifique a URL no config.js
- Teste a URL diretamente no navegador

### Imagens não carregam
- Configure storage de arquivos (Cloudinary ou Volumes)
- Verifique CORS no backend

### Login não funciona
- Verifique se o banco de dados está populado
- Certifique-se de criar um usuário admin

---

## 📧 Template de Email para o Docente

```
Assunto: FutMz - Aplicativo de Futebol - Disponível para Teste

Olá professor,

O aplicativo FutMz está pronto para avaliação:

🔗 LINK WEB: https://expo.dev/@seu-usuario/futmz

📱 LINK MOBILE: Escaneie o QR code no documento anexo

👤 CREDENCIAIS ADMIN:
   Usuário: admin
   Senha: admin123

📦 CÓDIGO-FONTE: https://github.com/VandroCr/FutMz

Funcionalidades disponíveis:
- ✅ Login/Registro de usuários
- ✅ Visualização de artigos
- ✅ Sistema de favoritos
- ✅ Painel administrativo
- ✅ Criação de artigos com imagens/vídeos
- ✅ Interface mobile responsiva

Qualquer dúvida, estou à disposição!

Att,
[Seu Nome]
```

---

Boa sorte! 🚀

