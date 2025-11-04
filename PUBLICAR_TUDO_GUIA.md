# 🚀 Guia Completo: Publicar Tudo (GitHub + Render + Expo)

## 🎯 Opção 1: Script Automático (RECOMENDADO)

Execute o script que faz tudo de uma vez:

```
PUBLICAR_TUDO.bat
```

Este script vai:
1. ✅ Enviar tudo para o GitHub
2. ✅ Render detecta e faz deploy automaticamente
3. ✅ Publicar no Expo

**Tempo total:** ~5-10 minutos

---

## 📋 Opção 2: Passo a Passo Manual

### 1️⃣ Publicar no GitHub

**Script rápido:**
```
PUBLICAR_GITHUB.bat
```

**OU manualmente:**
```bash
cd "C:\Users\vandr\OneDrive\Área de Trabalho\Revista"
git add .
git commit -m "Update: Atualização completa"
git push
```

---

### 2️⃣ Render (Automático)

O Render detecta mudanças no GitHub automaticamente!

**Você só precisa:**
1. Fazer o push para o GitHub (passo 1)
2. Aguardar ~5 minutos
3. Acompanhar em: https://dashboard.render.com

**Depois do deploy:**
1. Acesse: https://futmz.onrender.com/docs
2. Execute: `POST /api/setup` (criar admin)
3. Teste os endpoints

---

### 3️⃣ Publicar no Expo

**Script rápido:**
```
PUBLICAR_EXPO.bat
```

**OU manualmente:**
```bash
cd FutMz
npx expo login  # Se não estiver logado
npx eas update --branch production --message "Update: Nova versão"
```

**OU método antigo:**
```bash
cd FutMz
npx expo publish
```

---

## ⚠️ Checklist Antes de Publicar

Antes de executar os scripts, verifique:

- [ ] Todas as mudanças foram testadas localmente
- [ ] Backend está funcionando (`python backend/main.py`)
- [ ] Frontend está funcionando (`cd FutMz && npm start`)
- [ ] Imagens necessárias estão em `backend/uploads/`
- [ ] `.gitignore` está configurado corretamente
- [ ] Credenciais sensíveis não estão no código

---

## 📁 O Que Será Publicado

### GitHub
- ✅ Todo o código backend (`backend/`)
- ✅ Todo o código frontend (`FutMz/`)
- ✅ Imagens em `backend/uploads/` (se não estiverem no .gitignore)
- ✅ Arquivos de configuração
- ✅ Documentação

### Render (Backend)
- ✅ API FastAPI
- ✅ Banco de dados SQLite (criado no primeiro deploy)
- ✅ Arquivos estáticos (uploads/)

### Expo (Frontend)
- ✅ App React Native
- ✅ Configurações do Expo
- ✅ Assets (se houver)

---

## 🔄 Após Publicar

### 1. Verificar Backend (Render)

1. Acesse: https://futmz.onrender.com/docs
2. Teste: `GET /api/health` → Deve retornar `{"status": "healthy"}`
3. Execute: `POST /api/setup` → Cria admin e artigos
4. Teste: `GET /api/articles` → Deve retornar artigos

### 2. Verificar Frontend (Expo)

1. Abra o app Expo Go no celular
2. Procure pelo seu projeto
3. Atualize o app (puxe para baixo)
4. Teste todas as funcionalidades

---

## 🐛 Problemas Comuns

### Erro: "Git não reconhecido"
- **Solução:** Instale o Git: https://git-scm.com/downloads

### Erro: "Expo não encontrado"
- **Solução:** `npm install -g expo-cli` ou `npm install -g eas-cli`

### Erro: "Não está logado no Expo"
- **Solução:** Execute `npx expo login` e faça login

### Render não faz deploy
- **Solução:** Verifique se o GitHub está conectado no Render dashboard

### Expo não atualiza no celular
- **Solução:** Feche e reabra o Expo Go, ou desinstale e reinstale

---

## 📋 Comandos Rápidos

### GitHub
```bash
git add .
git commit -m "Update"
git push
```

### Render
- Automático após push no GitHub
- Ou force deploy em: https://dashboard.render.com

### Expo
```bash
cd FutMz
npx eas update --branch production
```

---

## ✅ Resumo

1. **GitHub:** `PUBLICAR_GITHUB.bat` ou `git push`
2. **Render:** Automático (~5 min após GitHub)
3. **Expo:** `PUBLICAR_EXPO.bat` ou `npx eas update`

**Ou tudo de uma vez:**
```
PUBLICAR_TUDO.bat
```

---

**Pronto! Agora você tem scripts para tudo!** 🎉
