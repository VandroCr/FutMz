@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🚀 ATUALIZAR RENDER COM ENDPOINT /api/setup
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos ao Git...
git add backend/main.py backend/verificar_artigos.py VERIFICAR_BANCO_LOCAL.bat ATUALIZAR_RENDER_AGORA.bat CRIAR_ADMIN_E_ARTIGOS.txt 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Git pode não estar no PATH ou arquivos já foram adicionados
    echo.
)

echo [2/3] Fazendo commit...
git commit -m "Add: Endpoint /api/setup para criar admin e artigos automaticamente" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Commit pode ter falhado ou não há mudanças
    echo.
)

echo [3/3] Enviando para GitHub...
git push 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    ⚠️  ERRO AO FAZER PUSH
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Possíveis causas:
    echo - Git não está instalado ou não está no PATH
    echo - Não está autenticado no GitHub
    echo - Repositório não está configurado
    echo.
    echo FAÇA MANUALMENTE:
    echo 1. Abra GitHub Desktop ou Git Bash
    echo 2. Faça commit e push manualmente
    echo 3. Ou execute os comandos no CMD:
    echo    git add backend/main.py
    echo    git commit -m "Add endpoint /api/setup"
    echo    git push
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ CÓDIGO ENVIADO PARA O GITHUB!
echo ═══════════════════════════════════════════════════════════
echo.
echo ⏱️  AGUARDE ~5 MINUTOS para o Render fazer deploy automaticamente
echo.
echo ═══════════════════════════════════════════════════════════
echo    📋 PRÓXIMOS PASSOS
echo ═══════════════════════════════════════════════════════════
echo.
echo 1. Aguarde o deploy terminar (~5 min)
echo 2. Acesse: https://futmz.onrender.com/docs
echo 3. Procure por "POST /api/setup"
echo 4. Clique em "Try it out" → "Execute"
echo 5. Veja as credenciais do admin criado!
echo.
echo OU simplesmente acesse:
echo https://futmz.onrender.com/api/setup
echo (precisa fazer POST, use o /docs para testar)
echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ DEPOIS DE CHAMAR O ENDPOINT
echo ═══════════════════════════════════════════════════════════
echo.
echo Teste se funcionou:
echo https://futmz.onrender.com/api/articles
echo.
echo Deve retornar 3 artigos ao invés de []
echo.
pause

