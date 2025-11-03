@echo off
chcp 65001 > nul
echo ===================================
echo   INSTALAR EAS CLI
echo ===================================
echo.

echo [INFO] Instalando EAS CLI globalmente...
echo.

npm install -g eas-cli

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ EAS CLI instalado com sucesso!
    echo.
    echo Próximos passos:
    echo 1. eas login
    echo 2. eas update:configure
    echo 3. eas update
    echo.
) else (
    echo.
    echo ❌ Erro ao instalar EAS CLI
    echo Verifique se o npm está instalado corretamente.
    echo.
)

pause

