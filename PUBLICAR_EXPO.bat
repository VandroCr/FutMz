@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    📱 PUBLICAR NO EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0\FutMz"

echo Verificando se está logado no Expo...
call npx expo whoami > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Você não está logado no Expo!
    echo.
    call npx expo login
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Erro ao fazer login!
        pause
        exit /b 1
    )
)

echo.
echo Publicando atualização no Expo...
echo.

call npx eas update --branch production --message "Update: Nova versão do app"

if %errorlevel% neq 0 (
    echo.
    echo Tentando método alternativo (expo publish)...
    call npx expo publish
)

if %errorlevel% equ 0 (
    echo.
    echo ✅ Atualização publicada no Expo!
    echo.
    echo 📱 No celular, abra Expo Go e atualize o app
) else (
    echo.
    echo ❌ Erro ao publicar!
    echo    Tente manualmente: npx eas update
)

echo.
pause

