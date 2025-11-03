@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🚀 ATUALIZAR PROJETO NO GITHUB E EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [1/3] Fazendo commit e push para GitHub...
echo.
git add FutMz/App.js FutMz/config.js FUNCIONALIDADES_TABELA_IMPLEMENTADAS.txt COMMIT_MUDANCAS.bat PUBLICAR_EXPO.bat ATUALIZAR_TUDO.bat
git commit -m "Feat: Login opcional, CRUD de tabelas e artilheiros, botao Entrar no header" 2>nul
git push

if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Git push pode ter falhado ou não há mudanças
    echo.
)

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ GITHUB ATUALIZADO!
echo ═══════════════════════════════════════════════════════════
echo.
echo [2/3] Agora vamos publicar no Expo...
echo.

cd FutMz

echo Executando: eas update --branch preview
echo.

eas update --branch preview --message "Update: Login opcional e CRUD de tabelas"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Falha ao publicar no Expo
    echo Execute manualmente: eas update --branch preview
    echo.
) else (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    ✅ ATUALIZAÇÃO PUBLICADA COM SUCESSO!
    echo ═══════════════════════════════════════════════════════════
)

echo.
echo ═══════════════════════════════════════════════════════════
echo    📋 PRÓXIMOS PASSOS
echo ═══════════════════════════════════════════════════════════
echo.
echo 1. Acesse: https://futmz.onrender.com
echo 2. Faça login como admin
echo 3. Crie alguns artigos
echo 4. No celular: Abra Expo Go e atualize (puxe para baixo)
echo.
pause

