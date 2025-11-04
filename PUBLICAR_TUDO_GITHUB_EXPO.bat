@echo off
chcp 65001 >nul
echo ==========================================
echo PUBLICAR TUDO: GITHUB + EXPO
echo ==========================================
echo.

echo [1/3] Adicionando arquivos ao Git...
git add . 2>nul
if %errorlevel% neq 0 (
    echo ❌ Erro ao adicionar arquivos. Verifique se Git está instalado.
    pause
    exit /b 1
)

echo.
echo [2/3] Fazendo commit...
git commit -m "Add: Scripts de exportacao e sincronizacao com Render" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Nenhuma mudança para commitar ou erro no commit.
)

echo.
echo [3/3] Fazendo push para GitHub...
git push 2>nul
if %errorlevel% neq 0 (
    echo ❌ Erro ao fazer push. Verifique sua conexão e credenciais Git.
    pause
    exit /b 1
)

echo.
echo ✅ Push para GitHub concluído!
echo.
echo O Render será atualizado automaticamente em alguns minutos.
echo.
echo ==========================================
echo [EXPO] Publicando atualizações...
echo ==========================================
echo.

cd FutMz

echo Publicando no Expo (branch preview)...
call eas update --branch preview --message "Sync: Backend Render e exportacao de dados" 2>nul

if %errorlevel% neq 0 (
    echo ⚠️  Erro ao publicar no Expo. Verifique se está logado: eas login
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ==========================================
echo ✅ PROCESSO CONCLUÍDO!
echo ==========================================
echo.
echo ✅ Mudanças enviadas para GitHub
echo ✅ Render será atualizado automaticamente
echo ✅ Expo atualizado (branch preview)
echo.
echo Aguarde alguns minutos para o Render fazer o deploy.
echo.
pause
