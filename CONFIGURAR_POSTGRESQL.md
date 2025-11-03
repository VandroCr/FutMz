# 🐘 Configurar PostgreSQL no Render (Opcional)

O Render oferece PostgreSQL grátis. Vamos configurar para produção profissional.

---

## 📋 Passo 1: Criar Banco PostgreSQL

1. No **Render Dashboard**: https://dashboard.render.com
2. **New + → PostgreSQL**
3. **Configurar**:
   - Name: `futmz-db`
   - Database: `futmz`
   - User: `futmz_user`
   - Region: `São Paulo`
   - Plan: **Free** ✅
4. **Create Database**

5. **Copiar Database URL** (será algo como):
```
postgres://futmz_user:senha@dpg-xxxxx-a.singapore-postgres.render.com/futmz
```

---

## 📋 Passo 2: Atualizar Código

Renomeie `database_production.py` para `database.py`:

```bash
mv backend/database_production.py backend/database.py
```

(OU manualmente copie o conteúdo de `database_production.py` para `database.py`)

---

## 📋 Passo 3: Instalar PostgreSQL Driver

Adicione ao `requirements.txt`:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic[email]==2.5.0
psycopg2-binary==2.9.9  # ← ADICIONAR ESTA LINHA
```

---

## 📋 Passo 4: Configurar Web Service

No seu Web Service no Render:

1. **Settings → Environment**
2. Adicione variável:
   - Key: `DATABASE_URL`
   - Value: `postgres://futmz_user:senha@host/futmz` (cole a URL completa)

3. **Manual Deploy** (para aplicar mudanças)

---

## 📋 Passo 5: Migrar Dados (Opcional)

Se você já tem dados no SQLite local:

```python
# Script temporário para migrar
from database import *
import sqlite3

# Conectar ao SQLite
sqlite_conn = sqlite3.connect("data/futmz.db")

# Ler dados do SQLite e escrever no PostgreSQL
# (Você precisaria escrever um script de migração personalizado)
```

---

## ⚠️ Importante: SQLite vs PostgreSQL

### SQLite (Desenvolvimento)
- ✅ Simples
- ✅ Já configurado
- ❌ Não funciona bem no Render (conflitos de escrita)
- ❌ Sem suporte a múltiplas instâncias

### PostgreSQL (Produção)
- ✅ Robusto
- ✅ Melhor para produção
- ✅ Suporta múltiplas instâncias
- ❌ Requer configuração extra

---

## 🎯 Recomendação

**Para apresentação ao docente**:
- Use SQLite no Render (pode funcionar para demonstração)
- Se der erro, configure PostgreSQL (10 minutos extras)

**Para produção real**:
- Sempre use PostgreSQL
- Configure desde o início

---

## 🆘 Troubleshooting

### Erro: "No module named psycopg2"
```bash
pip install psycopg2-binary
```

### Erro: "Could not connect to server"
- Verifique se copiou a DATABASE_URL correta
- Teste a conexão no Render Dashboard

### Erro: "Database does not exist"
- Certifique-se de que o database foi criado
- Verifique o nome correto na URL

---

## 📚 Referências

- Render PostgreSQL: https://render.com/docs/databases
- SQLAlchemy + PostgreSQL: https://docs.sqlalchemy.org/en/14/core/engines.html#postgresql

---

**Pronto!** Agora seu app está usando PostgreSQL profissional! 🎉

