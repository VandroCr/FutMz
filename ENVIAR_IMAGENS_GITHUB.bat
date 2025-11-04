@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    📸 ENVIAR IMAGENS PARA O GITHUB
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [1/4] Verificando imagens em backend/uploads/...
echo.

dir backend\uploads\*.jpg /b > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Nenhuma imagem .jpg encontrada em backend/uploads/
    echo.
    pause
    exit /b 1
)

echo ✅ Imagens encontradas!
echo.

echo [2/4] Adicionando imagens ao Git...
git add backend/uploads/*.jpg

echo.
echo [3/4] Verificando status...
git status --short backend/uploads/

echo.
echo [4/4] Fazendo commit...
git commit -m "Add: Imagens dos artigos para o Render"

echo.
echo ═══════════════════════════════════════════════════════════
echo    📤 ENVIANDO PARA O GITHUB...
echo ═══════════════════════════════════════════════════════════
echo.

git push

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ IMAGENS ENVIADAS!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Aguarde ~5 minutos para o Render fazer deploy
echo 2. Acompanhe em: https://dashboard.render.com
echo 3. Depois do deploy, teste as URLs:
echo    https://futmz.onrender.com/uploads/13d9f66c-c013-4984-9086-33c8374c7bee.jpg
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
