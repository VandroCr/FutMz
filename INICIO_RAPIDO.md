# 🚀 Guia Rápido - FutMz

## Instalação e Execução

### 1️⃣ Backend (API)

1. Abra um terminal e vá para o diretório backend:
```bash
cd backend
```

2. Instale as dependências (se ainda não fez):
```bash
pip install -r requirements.txt
```

3. Execute o servidor:
```bash
python main.py
```

O servidor estará rodando em: `http://localhost:8000`

📖 **Documentação da API**: http://localhost:8000/docs

### 2️⃣ Mobile (App)

1. Abra outro terminal e vá para o diretório FutMz:
```bash
cd FutMz
```

2. Instale as dependências (se ainda não fez):
```bash
npm install
```

3. Execute o aplicativo:
```bash
npm start
```

4. Escaneie o QR code com o app **Expo Go** no seu celular ou:
   - Pressione `a` para Android
   - Pressione `i` para iOS
   - Pressione `w` para Web

## ⚙️ Configuração da URL da API

Se estiver usando **emulador Android**, a URL já está configurada para `http://10.0.2.2:8000/api`

Se estiver usando **dispositivo físico** ou **emulador iOS**, você precisa:

1. Descobrir o IP da sua máquina na rede local:
   - **Windows**: `ipconfig` no terminal
   - **Mac/Linux**: `ifconfig` no terminal

2. Atualizar o arquivo `FutMz/config.js`:
```javascript
export const API_URL = __DEV__ 
  ? 'http://SEU_IP:8000/api' // Exemplo: 'http://192.168.1.100:8000/api'
  : 'https://seu-dominio.com/api';
```

## 📱 Testando o App

1. **Registre uma conta**: Toque em "Cadastre-se"
2. **Faça login**: Use as credenciais criadas
3. **Explore os artigos**: Navegue pela Home
4. **Adicione favoritos**: Toque no coração nos artigos
5. **Comente**: Deixe comentários nos artigos

## 🎨 Funcionalidades Disponíveis

- ✅ Cadastro e login de usuários
- ✅ Visualização de artigos
- ✅ Busca e filtros
- ✅ Comentários
- ✅ Favoritos
- ✅ Perfil de usuário

## ⚠️ Notas Importantes

1. **Backend deve estar rodando** antes de usar o app
2. **Desabilite o firewall** temporariamente se houver problemas de conexão
3. **Use a mesma rede Wi-Fi** no celular e no computador

## 🐛 Resolução de Problemas

### Erro de conexão com a API:
- Verifique se o backend está rodando
- Confira a URL no `config.js`
- Certifique-se de estar na mesma rede Wi-Fi

### App não abre:
- Execute `npm install` novamente
- Limpe o cache: `npm start -- --clear`

### Backend não inicia:
- Verifique se o Python está instalado
- Instale as dependências: `pip install -r requirements.txt`

## 📞 Próximos Passos

1. Teste todas as funcionalidades
2. Crie alguns artigos (via API/docs)
3. Explore o código-fonte
4. Personalize o design

Boa sorte com o projeto! 🎉



