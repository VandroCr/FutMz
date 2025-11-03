@echo off
chcp 65001 > nul
echo.
echo ═══════════════════════════════════════════════════════════
echo        🚀 PUBLICAR NO EXPO - TUDO EM UM
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo ═══════════════════════════════════════════════════════════
echo   PASSO 1: ATUALIZAR BACKEND NO RENDER
echo ═══════════════════════════════════════════════════════════
echo.
echo Adicionando mudanças ao Git...
git add . 2>nul

echo.
echo Fazendo commit...
git commit -m "Add: Todos os artigos e scripts de importacao" 2>nul

echo.
echo Fazendo push para GitHub...
git push 2>nul

if %ERRORLEVEL% EQ 0 (
    echo.
    echo ✅ Backend atualizado no GitHub!
    echo ⏱️  Aguarde ~5 minutos para deploy no Render
    echo.
) else (
    echo.
    echo ⚠️  Aviso: Push pode ter falhado
    echo     Faça manualmente pelo GitHub Desktop se necessário
    echo.
)

pause

echo.
echo ═══════════════════════════════════════════════════════════
echo   PASSO 2: PUBLICAR APP NO EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd FutMz

if not exist "package.json" (
    echo [ERRO] Não foi possível navegar para FutMz
    pause
    exit /b 1
)

echo [INFO] Diretório: %CD%
echo.

echo Verificando se você está logado no Expo...
eas whoami 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Você não está logado no Expo
    echo.
    echo Vou fazer login agora...
    echo.
    eas login
    echo.
)

echo.
echo Publicando atualização no Expo...
echo.

eas update --branch preview --message "Add: Render URL forçada e todos os artigos"

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
echo        ✅ ATUALIZAÇÃO PUBLICADA COM SUCESSO!
echo ═══════════════════════════════════════════════════════════
echo.
echo Próximos passos:
echo.
echo 1. Aguarde ~5 min para o Render fazer deploy
echo.
echo 2. Acesse: https://futmz.onrender.com/docs
   echo    → Procure "POST /api/setup"
   echo    → "Try it out" → "Execute"
   echo    (Isso cria o admin e artigos!)
echo.
echo 3. No celular:
echo    - Abra o Expo Go
echo    - Puxe para baixo para atualizar
echo    - Os artigos devem aparecer!
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause

