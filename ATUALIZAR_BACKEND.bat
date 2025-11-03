@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🔧 ATUALIZAR BACKEND NO RENDER
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [INFO] Fazendo commit e push para GitHub...
echo.
git add backend/main.py
git commit -m "Add: Endpoint /api/setup para criar admin e artigos automaticamente"
git push

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ BACKEND ENVIADO PARA O GITHUB!
echo ═══════════════════════════════════════════════════════════
echo.
echo AGUARDE ~5 MINUTOS para o Render fazer o deploy automaticamente
echo.
echo DEPOIS, execute estes passos:
echo.
echo 1. Abra: https://futmz.onrender.com/docs
echo 2. Procure por "POST /api/setup"
echo 3. Clique em "Try it out"
echo 4. Clique em "Execute"
echo 5. Credenciais do admin aparecerão na resposta!
echo.
echo OU simplesmente acesse:
echo https://futmz.onrender.com/api/setup
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause

