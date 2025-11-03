@echo off
chcp 65001 > nul
echo ===================================
echo   PUBLICAR APP PARA WEB
echo ===================================
echo.

cd /d "%~dp0FutMz"

echo [INFO] Gerando versão web estática...
echo.

npx expo export:web

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCESSO! App gerado na pasta 'web-build'
    echo.
    echo Próximos passos:
    echo 1. A pasta web-build contém o app pronto
    echo 2. Você pode hospedar em:
    echo    - GitHub Pages
    echo    - Netlify
    echo    - Vercel
    echo    - Qualquer servidor web
    echo.
    echo Para testar localmente:
    echo npx serve web-build
    echo.
) else (
    echo.
    echo ❌ Erro ao gerar versão web
    echo.
)

pause

