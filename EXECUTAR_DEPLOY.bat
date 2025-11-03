@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🚀 EXECUTANDO DEPLOY PARA O RENDER
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos ao Git...
git add backend/main.py backend/verificar_artigos.py
git add ARTIGOS_COM_IMAGENS.txt COMO_USAR_ENDPOINT_SETUP.txt DEPLOY_MANUAL_COMPLETO.txt
git add ATUALIZAR_RENDER_AGORA.bat VERIFICAR_BANCO_LOCAL.bat EXECUTAR_DEPLOY.bat
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Git pode não estar no PATH
    echo.
)

echo.
echo [2/3] Fazendo commit...
git commit -m "Add: Endpoint /api/setup com imagens nos artigos" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Commit pode ter falhado ou não há mudanças novas
    echo.
)

echo.
echo [3/3] Enviando para GitHub...
git push 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    ⚠️  ERRO AO FAZER PUSH
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Git não está disponível ou não está autenticado.
    echo.
    echo SOLUÇÃO: Use GitHub Desktop ou Git Bash
    echo.
    echo Ou execute MANUALMENTE no CMD:
    echo   git add backend/main.py
    echo   git commit -m "Add endpoint /api/setup com imagens"
    echo   git push
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ DEPLOY ENVIADO PARA O GITHUB!
echo ═══════════════════════════════════════════════════════════
echo.
echo O Render vai fazer deploy automaticamente em ~5 minutos
echo.
echo Você pode acompanhar o progresso em:
echo https://dashboard.render.com
echo.
echo ═══════════════════════════════════════════════════════════
echo    📋 DEPOIS DO DEPLOY TERMINAR
echo ═══════════════════════════════════════════════════════════
echo.
echo 1. Acesse: https://futmz.onrender.com/docs
echo 2. Procure por "POST /api/setup"
echo 3. Clique em "Try it out" → "Execute"
echo 4. Os artigos serão criados COM IMAGENS!
echo.
pause

