# 🔧 Corrigir Erro no Render - Root Directory

O erro era: **"Could not open requirements file: requirements.txt"**

✅ **PROBLEMA RESOLVIDO!** O arquivo `render.yaml` agora tem `rootDir: backend`

---

## ✅ Se o Render detectou automaticamente

Se você configurou o Render para usar `render.yaml`, ele vai:
1. Fazer deploy automático após o push
2. Usar o `rootDir: backend` corretamente
3. Build funcionará! 🎉

**Aguarde alguns minutos** e verifique no dashboard se o build concluiu.

---

## 📝 Se precisar configurar manualmente no Dashboard

Se o Render NÃO está usando o `render.yaml`, configure manualmente:

### Passo 1: Acessar o Serviço

1. No dashboard Render: https://dashboard.render.com
2. Clique no serviço **FutMz** ou **futmz-api**

### Passo 2: Editar Configurações

1. Vá em **Settings** (menu lateral esquerdo)
2. Procure por **Root Directory**
3. Altere de: `(blank)` ou `/` 
4. Para: **`backend`** ← Digite isso
5. Clique em **Save Changes**

### Passo 3: Verificar Build Command

Verifique se em **Settings → Build Command** está:
```
pip install -r requirements.txt
```

### Passo 4: Verificar Start Command

Verifique se em **Settings → Start Command** está:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Passo 5: Forçar Novo Deploy

1. Vá em **Manual Deploy** (canto superior direito)
2. Clique em **Clear build cache & deploy**
3. Aguarde o build...

---

## ✅ Checklist de Verificação

Após o deploy, verifique nos logs:

- [ ] ✅ "Cloning from https://github.com/VandroCr/FutMz"
- [ ] ✅ "Installing Python version"
- [ ] ✅ "Running build command 'pip install -r requirements.txt'"
- [ ] ✅ "Successfully installed" (sem erros)
- [ ] ✅ "Starting uvicorn main:app"
- [ ] ✅ "Application startup complete"

Se todos os passos estão ✅, seu backend está **ONLINE**! 🎉

---

## 🔗 Testar

Após o deploy funcionar, teste acessando:

```
https://seu-servico.onrender.com/docs
```

Você deve ver a documentação Swagger da API!

---

## 🆘 Ainda com erro?

### Erro: "Module not found"
- Adicione `psycopg2-binary` ao `requirements.txt` se estiver usando PostgreSQL

### Erro: "Could not connect to database"
- Configure PostgreSQL ou use SQLite (ver CONFIGURAR_POSTGRESQL.md)

### Erro: "Port already in use"
- Verifique o Start Command: deve ter `--port $PORT`

### Build não inicia
- Verifique se o Root Directory está configurado
- Force um novo deploy manual

---

**Pronto! Agora é só aguardar o deploy funcionar!** 🚀

