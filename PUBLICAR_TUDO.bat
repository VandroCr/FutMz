@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🚀 PUBLICAR TUDO: GITHUB + RENDER + EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo 📋 Este script vai:
echo    1. Enviar TUDO para o GitHub (backend + frontend + imagens)
echo    2. O Render vai fazer deploy automaticamente
echo    3. Publicar atualização no Expo
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════
echo    [1/3] ENVIANDO PARA O GITHUB
echo ═══════════════════════════════════════════════════════════
echo.

echo Verificando status do Git...
git status --short

echo.
echo Adicionando TODOS os arquivos...
git add .

echo.
echo Fazendo commit...
git commit -m "Update: Atualização completa do projeto"

echo.
echo Enviando para o GitHub...
git push

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao fazer push para o GitHub!
    echo    Verifique sua conexão e credenciais do Git
    pause
    exit /b 1
)

echo.
echo ✅ Arquivos enviados para o GitHub!
echo.

echo ═══════════════════════════════════════════════════════════
echo    [2/3] RENDER (DEPLOY AUTOMÁTICO)
echo ═══════════════════════════════════════════════════════════
echo.
echo ✅ O Render vai detectar as mudanças automaticamente!
echo.
echo 📋 Aguarde ~5 minutos para o deploy terminar.
echo    Acompanhe em: https://dashboard.render.com
echo.
echo ⚠️  IMPORTANTE: Depois do deploy, execute:
echo    1. Acesse: https://futmz.onrender.com/docs
echo    2. Execute: POST /api/setup (para criar admin)
echo    3. Teste se tudo funciona
echo.

pause

echo.
echo ═══════════════════════════════════════════════════════════
echo    [3/3] PUBLICAR NO EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd FutMz

echo Verificando se está logado no Expo...
call npx expo whoami > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Você não está logado no Expo!
    echo    Fazendo login...
    echo.
    call npx expo login
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Erro ao fazer login no Expo!
        echo    Tente manualmente: cd FutMz ^&^& npx expo login
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
    echo ⚠️  Erro ao publicar. Tentando método alternativo...
    call npx expo publish
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Erro ao publicar no Expo!
        echo    Tente manualmente: cd FutMz ^&^& npx eas update
        pause
        exit /b 1
    )
)

cd ..

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ TUDO PUBLICADO COM SUCESSO!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📋 RESUMO:
echo.
echo ✅ GitHub: Código enviado
echo ⏳ Render: Aguardando deploy (~5 min)
echo ✅ Expo: Atualização publicada
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Aguarde ~5 minutos para o Render fazer deploy
echo 2. Acesse: https://futmz.onrender.com/docs
echo 3. Execute: POST /api/setup (criar admin)
echo 4. Teste os endpoints
echo 5. No celular: Abra Expo Go → Atualize o app
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
