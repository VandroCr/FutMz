# Como Criar Usuário Administrador

## Passos para Criar um Admin

### 1. Navegar até a pasta backend
```bash
cd backend
```

### 2. Criar o administrador

**Opção A - Modo Interativo:**
```bash
python create_admin.py
```
O script vai pedir:
- Username
- Email
- Senha
- Nome completo (opcional)

**Opção B - Passar parâmetros diretamente:**
```bash
python create_admin.py admin admin@futmz.com senha123
```

### 3. Criar Artigos de Exemplo (Opcional)
```bash
python create_sample_articles.py
```

Isso criará 5 artigos de exemplo já publicados.

## Exemplo Completo

```bash
cd backend

# Criar admin
python create_admin.py admin admin@futmz.com senha123

# Criar artigos de exemplo
python create_sample_articles.py
```

## Credenciais Padrão de Teste

- **Username:** admin
- **Email:** admin@futmz.com
- **Senha:** senha123

⚠️ **IMPORTANTE:** Altere a senha em produção!

## Próximos Passos

Depois de criar o admin:

1. **Faça login no app** com as credenciais do admin
2. **Use a API** para criar artigos adicionais
3. Acesse: http://localhost:8000/docs para ver todos os endpoints

## Criar Artigos via API

Use o endpoint `POST /api/articles` com o token JWT do admin:

1. Faça login: `POST /api/users/login`
2. Copie o token retornado
3. Use o token em: `POST /api/articles` (Authorization: Bearer <token>)



