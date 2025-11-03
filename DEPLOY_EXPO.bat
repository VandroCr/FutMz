@echo off
chcp 65001 > nul
echo ===================================
echo   PUBLICAR APP NO EXPO
echo ===================================
echo.

:: Navegar para o diretório do app
cd /d "%~dp0FutMz"
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Não foi possível navegar para o diretório FutMz
    pause
    exit /b 1
)

echo [INFO] Diretório: %CD%
echo.

:: Verificar se está logado no Expo
echo [INFO] Verificando login no Expo...
npx expo whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Você não está logado no Expo!
    echo.
    set /p resposta="Deseja fazer login agora? (s/n): "
    if /i "%resposta%"=="s" (
        npx expo login
    ) else (
        echo [ERRO] É necessário estar logado no Expo para publicar!
        pause
        exit /b 1
    )
) else (
    echo [OK] Logado no Expo!
    echo.
)

:: Perguntar qual tipo de publicação
echo Escolha o tipo de publicação:
echo 1. Publicação Web (navegador)
echo 2. Publicação Mobile (Expo Go)
echo 3. Build Standalone (APK/IPA)
echo.
set /p opcao="Digite a opção (1/2/3): "

if "%opcao%"=="1" (
    echo.
    echo [INFO] Publicando para Web...
    echo.
    npx expo export:web
    echo.
    echo [SUCESSO] App publicado para web!
    echo.
    echo Próximos passos:
    echo 1. O código foi gerado na pasta 'web-build'
    echo 2. Publique essa pasta em um servidor web
    echo 3. Ou use: npx serve web-build
    echo.
) else if "%opcao%"=="2" (
    echo.
    echo [INFO] Publicando para Expo Go (Mobile)...
    echo.
    npx expo publish
    echo.
    if %ERRORLEVEL% EQU 0 (
        echo [SUCESSO] App publicado no Expo!
        echo.
        echo Seu app está disponível em: https://expo.dev/@seu-usuario/futmz
        echo.
        echo Próximos passos:
        echo 1. Compartilhe o link com o docente
        echo 2. Ou escaneie o QR code exibido acima
        echo.
    ) else (
        echo [ERRO] Falha ao publicar no Expo
        echo Verifique os logs acima para mais detalhes.
    )
) else if "%opcao%"=="3" (
    echo.
    echo [INFO] Iniciando build standalone...
    echo.
    echo Este processo pode demorar vários minutos...
    echo.
    npx eas build --platform all --profile preview
    echo.
    if %ERRORLEVEL% EQU 0 (
        echo [SUCESSO] Build concluído!
        echo Verifique o link fornecido acima para baixar o APK/IPA
    ) else (
        echo [ERRO] Falha no build
    )
) else (
    echo [ERRO] Opção inválida!
)

echo.
pause

