@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo        PUBLICANDO ATUALIZAÇÃO NO EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0FutMz"

if not exist "package.json" (
    echo [ERRO] Não foi possível navegar para o diretório FutMz
    pause
    exit /b 1
)

echo [INFO] Diretório: %CD%
echo.

echo [INFO] Publicando atualização no Expo...
echo.

eas update --branch preview --message "Update: Login opcional e CRUD de tabelas"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao publicar atualização
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo        ✅ ATUALIZAÇÃO PUBLICADA COM SUCESSO!
echo ═══════════════════════════════════════════════════════════
echo.
echo Próximos passos:
echo 1. Abra o Expo Go no seu celular
echo 2. Puxe para baixo para atualizar o app
echo 3. Os artigos devem aparecer!
echo.
pause

