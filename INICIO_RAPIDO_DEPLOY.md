# 🚀 INÍCIO RÁPIDO - Deploy FutMz

## ⏱️ Tempo estimado: 30 minutos

Siga ESTES passos na ordem:

---

## 1️⃣ PUBLICAR NO GITHUB (5 min)

### Usando GitHub Desktop (Mais Fácil):

1. **Download**: https://desktop.github.com/
2. **Instalar** e fazer login
3. **File → Add Local Repository**
   - Pasta: `C:\Users\vandr\OneDrive\Área de Trabalho\Revista`
4. **Publicar**:
   - Botão: "Publish repository"
   - URL: `https://github.com/VandroCr/FutMz.git`
   - "Keep this code private" → **DESMARQUE** (público)
   - **Publish** ✅

---

## 2️⃣ HOSPEDAR BACKEND NO RENDER.COM (15 min)

### Passo a Passo:

1. **Acesse**: https://dashboard.render.com
2. **Login com GitHub**
3. **New + → Web Service**
4. **Connect repository**:
   - Selecione: `VandroCr/FutMz`
   - Branch: `main`
5. **Configurar**:
   - Name: `futmz-api`
   - Region: `São Paulo` (mais perto do Brasil)
   - Branch: `main`
   - Root Directory: `backend` ← **IMPORTANTE**
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Plan**: `Free` ✅
7. **Create Web Service** → **Aguarde o deploy** (5-10 min)

### Anotar a URL:

Após o deploy, você verá uma URL tipo:
```
https://futmz-api.onrender.com
```

✅ **COPIE ESSA URL** - você vai usar agora!

---

## 3️⃣ CONFIGURAR APP PARA PRODUÇÃO (2 min)

Edite o arquivo `FutMz/config.js`:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// IMPORTANTE: Substitua pela URL do seu backend no Render!
const PRODUCTION_URL = 'https://futmz-api.onrender.com'; // ← COLE AQUI

const DEV_API_URL = Platform.OS === 'web' 
  ? 'http://localhost:8000/api' 
  : 'http://192.168.43.171:8000/api';

const DEV_SERVER_URL = Platform.OS === 'web'
  ? 'http://localhost:8000'
  : 'http://192.168.43.171:8000';

export const API_URL = __DEV__ 
  ? DEV_API_URL
  : `${PRODUCTION_URL}/api`; // ← ATUALIZADO

export const SERVER_URL = __DEV__ 
  ? DEV_SERVER_URL
  : PRODUCTION_URL; // ← ATUALIZADO

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@FutMz:auth_token',
};

// ... resto do código ...
```

💾 **Salve o arquivo**

---

## 4️⃣ FAZER COMMIT NO GITHUB (1 min)

No GitHub Desktop:

1. **Veja as mudanças** (deve mostrar `config.js` modificado)
2. **Summary**: "Configurar URL de produção para Render"
3. **Commit to main**
4. **Push origin** (enviar para GitHub)

---

## 5️⃣ PUBLICAR APP NO EXPO (5 min)

### Terminal:

```bash
cd "C:\Users\vandr\OneDrive\Área de Trabalho\Revista\FutMz"
npx expo login
```

Digite suas credenciais Expo (ou crie conta em https://expo.dev)

### Publicar:

```bash
npx expo publish
```

Aguarde o build... você verá algo assim:

```
✅ Project published!
URL: exp://exp.host/@seu-usuario/futmz

Web Dashboard: https://expo.dev/@seu-usuario/futmz
```

🎉 **COPIE ESSE LINK**!

---

## 6️⃣ TESTAR TUDO (5 min)

### Teste Backend:

Abra no navegador:
```
https://futmz-api.onrender.com/docs
```

✅ Deve aparecer a documentação Swagger da API

### Teste App:

**No navegador** (mais fácil):
```
https://expo.dev/@seu-usuario/futmz
```

**No celular**:
- Instale "Expo Go" (Google Play / App Store)
- Escaneie o QR code mostrado no terminal

---

## 7️⃣ CRIAR USUÁRIO ADMIN (2 min)

### Opção A: Via Console do Render

1. Vá para seu serviço no Render
2. **Logs** → **Connect via SSH**
3. Execute:
```bash
python create_admin.py
```

### Opção B: Via Código Local

Execute em sua máquina:
```bash
cd backend
python create_admin.py
```
(E após criar, faça login no app web e use essas credenciais)

---

## ✅ CHECKLIST FINAL

- [ ] Código no GitHub: https://github.com/VandroCr/FutMz
- [ ] Backend funcionando: https://futmz-api.onrender.com/docs
- [ ] App publicado: https://expo.dev/@seu-usuario/futmz
- [ ] Login admin funcionando
- [ ] Artigos aparecendo
- [ ] Imagens carregando
- [ ] Testado no navegador ✅
- [ ] Testado no celular ✅

---

## 📧 ENVIAR PARA O DOCENTE

Template de mensagem:

```
Assunto: FutMz - Projeto Disponível para Avaliação

Olá professor,

Segue o projeto FutMz finalizado:

🔗 APP WEB: https://expo.dev/@seu-usuario/futmz
📱 APP MOBILE: Use Expo Go e escaneie: [QR CODE]
💻 CÓDIGO: https://github.com/VandroCr/FutMz
🔧 API: https://futmz-api.onrender.com/docs

👤 LOGIN ADMIN:
   Usuário: admin
   Senha: admin123

Funcionalidades:
✅ Login/Registro
✅ Visualização de artigos
✅ Criação de artigos (admin)
✅ Upload de imagens/vídeos
✅ Sistema de favoritos
✅ Interface responsiva

Qualquer dúvida, estou à disposição!

Att,
[Seu Nome]
```

---

## 🆘 PROBLEMAS COMUNS

### Backend não inicia no Render
- Verifique os logs no Render dashboard
- Certifique-se que Root Directory = `backend`

### App não conecta à API
- Verifique se a URL no `config.js` está correta
- Teste a URL no navegador primeiro: `/docs`

### Imagens não carregam
- Render Free pode ter limitações com uploads
- Use Cloudinary como alternativa (ver guia completo)

### "Module not found" no Render
- Verifique se `requirements.txt` está na pasta backend
- Adicione: `psycopg2-binary` (para PostgreSQL)

---

## 🎯 PRÓXIMOS PASSOS (Opcional)

- [ ] Adicionar mais artigos
- [ ] Melhorar design
- [ ] Adicionar funcionalidades extras
- [ ] Configurar PostgreSQL (deixar de usar SQLite)
- [ ] Adicionar analytics

---

**Pronto! 🎉** Seu app está no ar e acessível para o docente!

