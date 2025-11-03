# Como Publicar o Projeto FutMz no GitHub

Siga estes passos para enviar o projeto para o repositório GitHub: https://github.com/VandroCr/FutMz.git

## Pré-requisitos

1. **Git instalado**: Baixe e instale o Git em https://git-scm.com/downloads
2. **Conta GitHub**: Certifique-se de ter acesso à conta https://github.com/VandroCr

## Passo a Passo

### 1. Abra o Terminal/CMD no diretório do projeto

Navegue até o diretório `Revista`:
```bash
cd "C:\Users\vandr\OneDrive\Área de Trabalho\Revista"
```

### 2. Inicialize o repositório Git (se ainda não foi feito)

```bash
git init
```

### 3. Configure o Git (se ainda não foi feito)

```bash
git config user.name "VandroCr"
git config user.email "seu-email@exemplo.com"
```

### 4. Crie um arquivo .gitignore

Crie um arquivo `.gitignore` na raiz do projeto com o seguinte conteúdo:

```
# Node modules
node_modules/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
*.db

# Uploads/Arquivos temporários
backend/uploads/*.jpg
backend/uploads/*.png
backend/uploads/*.mp4

# Configurações do IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/

# Sensíveis
.env
config.local.js
```

### 5. Adicione todos os arquivos ao Git

```bash
git add .
```

### 6. Faça o commit inicial

```bash
git commit -m "Initial commit: FutMz - Aplicativo de Futebol Moçambicano"
```

### 7. Configure o repositório remoto

```bash
git remote add origin https://github.com/VandroCr/FutMz.git
```

### 8. Envie o código para o GitHub

```bash
git branch -M main
git push -u origin main
```

## Comandos Úteis para Atualizações Futuras

Após fazer alterações no código:

```bash
# Ver o status das alterações
git status

# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Enviar para o GitHub
git push
```

## Estrutura do Projeto

O projeto FutMz contém:

- **FutMz/**: Aplicativo React Native (Frontend)
- **backend/**: API FastAPI (Backend)
- **README.md**: Documentação principal
- Outros arquivos de configuração e documentação

## Notas Importantes

1. **Banco de Dados**: O arquivo `backend/data/futmz.db` pode ser grande. Se desejar, adicione-o ao `.gitignore` e forneça instruções para criá-lo.

2. **Uploads**: As imagens em `backend/uploads/` não devem ser enviadas ao GitHub. Já estão no `.gitignore`.

3. **Variáveis de Ambiente**: Nunca commite arquivos `.env` com credenciais reais.

4. **Credenciais Admin**: Certifique-se de que as credenciais de administrador não estejam hardcoded no código.

## Resolução de Problemas

### Erro: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/VandroCr/FutMz.git
```

### Erro: "Updates were rejected"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Reset completo (CUIDADO!)
Se quiser recomeçar do zero:
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VandroCr/FutMz.git
git push -u origin main --force
```

## Ajuda

Para mais informações sobre Git e GitHub:
- Documentação Git: https://git-scm.com/doc
- Documentação GitHub: https://docs.github.com/pt
- GitHub CLI: https://cli.github.com/

