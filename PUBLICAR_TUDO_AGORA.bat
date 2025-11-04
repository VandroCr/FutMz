@echo off
chcp 65001 > nul
echo.
echo ═══════════════════════════════════════════════════════════
echo        🚀 PUBLICAR TUDO: GITHUB + RENDER + EXPO
echo ═══════════════════════════════════════════════════════════
echo.
echo Este script vai:
echo   1. Enviar mudanças para o GitHub
echo   2. Render vai fazer deploy automaticamente
echo   3. Publicar atualização no Expo
echo.
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

REM Verificar se está no diretório correto
if not exist "FutMz" (
    echo [ERRO] Diretório FutMz não encontrado!
    echo Certifique-se de executar este script na raiz do projeto.
    pause
    exit /b 1
)

echo ═══════════════════════════════════════════════════════════
echo   PASSO 1/3: ENVIAR PARA O GITHUB
echo ═══════════════════════════════════════════════════════════
echo.

echo [1.1] Verificando status do Git...
git status --short

echo.
echo [1.2] Adicionando TODAS as mudanças...
git add .

echo.
echo [1.3] Fazendo commit...
set "COMMIT_MSG=Update: Deploy completo - %date% %time:~0,5%"
git commit -m "%COMMIT_MSG%" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Nenhuma mudança para commitar ou commit falhou
    echo Continuando mesmo assim...
    echo.
) else (
    echo.
    echo ✅ Commit realizado!
    echo.
)

echo [1.4] Enviando para o GitHub...
git push

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Aviso: Push para GitHub pode ter falhado
    echo     Verifique sua conexão ou credenciais
    echo     Você pode fazer push manualmente depois
    echo.
    pause
) else (
    echo.
    echo ✅ Mudanças enviadas para o GitHub!
    echo.
    echo ⏱️  Render vai detectar as mudanças e fazer deploy automaticamente
    echo    Aguarde ~5 minutos para o deploy terminar
    echo.
)

echo ═══════════════════════════════════════════════════════════
echo   PASSO 2/3: VERIFICAR BACKEND (RENDER)
echo ═══════════════════════════════════════════════════════════
echo.
echo O Render vai fazer deploy automaticamente após o push.
echo.
echo Para verificar o status:
echo   https://dashboard.render.com
echo.
echo Para criar admin e artigos depois do deploy:
echo   1. Acesse: https://futmz.onrender.com/docs
echo   2. Execute: POST /api/setup
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════
echo   PASSO 3/3: PUBLICAR NO EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd FutMz

if not exist "package.json" (
    echo [ERRO] Não foi possível navegar para FutMz
    pause
    exit /b 1
)

echo [3.1] Verificando se está logado no Expo...
eas whoami 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Você não está logado no Expo
    echo.
    echo Vou fazer login agora...
    echo.
    eas login
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERRO] Falha ao fazer login no Expo
        echo.
        echo Verifique se o eas-cli está instalado:
        echo   npm install -g eas-cli
        echo.
        echo Depois execute manualmente:
        echo   cd FutMz
        echo   eas login
        echo   eas update --branch preview
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [3.2] Publicando atualização no Expo...
echo.
echo Aguarde... isso pode levar alguns minutos...
echo.

eas update --branch preview --message "Update: Deploy completo - %date%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    ⚠️  ERRO AO PUBLICAR NO EXPO
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Possíveis causas:
    echo - eas-cli não está instalado: npm install -g eas-cli
    echo - Não está autenticado no Expo
    echo - Problema de conexão
    echo.
    echo Tente executar manualmente:
    echo   cd FutMz
    echo   eas login
    echo   eas update --branch preview
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo        ✅ DEPLOY COMPLETO COM SUCESSO!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📋 RESUMO:
echo.
echo ✅ GitHub atualizado
echo ✅ Render fazendo deploy (aguarde ~5 min)
echo ✅ Expo atualizado
echo.
echo ═══════════════════════════════════════════════════════════
echo   PRÓXIMOS PASSOS
echo ═══════════════════════════════════════════════════════════
echo.
echo 1️⃣ BACKEND (Render):
echo    - Aguarde ~5 minutos para o deploy terminar
echo    - Acesse: https://futmz.onrender.com/docs
echo    - Execute: POST /api/setup (cria admin e artigos)
echo.
echo 2️⃣ FRONTEND (Expo):
echo    - Abra o Expo Go no celular
echo    - Puxe para baixo para atualizar
echo    - As mudanças devem aparecer!
echo.
echo 3️⃣ VERIFICAR:
echo    - Backend: https://futmz.onrender.com/api/health
echo    - Artigos: https://futmz.onrender.com/api/articles
echo    - Swagger: https://futmz.onrender.com/docs
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
