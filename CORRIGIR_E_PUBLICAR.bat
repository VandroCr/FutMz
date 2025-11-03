@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🔧 CORRIGIR E PUBLICAR NO EXPO
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [PASSO 1/2] Fazendo commit e push para GitHub...
echo.
git add FutMz/config.js
git commit -m "Fix: Forcar uso do Render em producao" 2>nul
git push

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ GITHUB ATUALIZADO!
echo ═══════════════════════════════════════════════════════════
echo.
echo [PASSO 2/2] Publicando no Expo...
echo.

cd FutMz
eas update --branch preview --message "Fix: Configurado para sempre usar Render"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao publicar no Expo
    echo Execute manualmente: eas update --branch preview
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ ATUALIZAÇÃO PUBLICADA COM SUCESSO!
echo ═══════════════════════════════════════════════════════════
echo.
echo ═══════════════════════════════════════════════════════════
echo    ⚠️  IMPORTANTE: ADICIONAR ARTIGOS!
echo ═══════════════════════════════════════════════════════════
echo.
echo O app está configurado para usar o Render, mas o banco
echo de dados está vazio!
echo.
echo AGORA FAÇA:
echo 1. Acesse: https://futmz.onrender.com
echo 2. Login como admin
echo 3. Crie 3-4 artigos
echo 4. No celular: Atualize o app (puxe para baixo)
echo.
pause

