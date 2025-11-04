@echo off
chcp 65001 > nul
echo.
echo ═══════════════════════════════════════════════════════════
echo        📱 PUBLICAR NO EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0FutMz"

if not exist "package.json" (
    echo [ERRO] Diretório FutMz nao encontrado!
    echo.
    echo Pressione qualquer tecla para fechar...
    pause > nul
    exit /b 1
)

echo [1/3] Verificando login no Expo...
eas whoami
echo.

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Voce nao esta logado no Expo!
    echo.
    echo Faca login primeiro:
    echo   eas login
    echo.
    echo Pressione qualquer tecla para fechar...
    pause > nul
    exit /b 1
)

echo [2/3] Publicando atualizacao no Expo...
echo.
echo Aguarde... isso pode levar alguns minutos...
echo.

eas update --branch preview --message "Update: Deploy completo"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo        ❌ ERRO AO PUBLICAR NO EXPO
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Possiveis causas:
    echo - Problema de conexao
    echo - eas-cli nao esta instalado
    echo - Credenciais invalidas
    echo.
    echo Tente executar manualmente:
    echo   cd FutMz
    echo   eas update --branch preview
    echo.
    echo Pressione qualquer tecla para fechar...
    pause > nul
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo        ✅ ATUALIZACAO PUBLICADA COM SUCESSO!
echo ═══════════════════════════════════════════════════════════
echo.
echo [3/3] Proximos passos:
echo.
echo 1. Abra o Expo Go no seu celular
echo 2. Puxe para baixo para atualizar o app
echo 3. As mudancas devem aparecer!
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo Pressione qualquer tecla para fechar...
pause > nul
