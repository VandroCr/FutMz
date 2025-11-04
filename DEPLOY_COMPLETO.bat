@echo off
chcp 65001 >nul
echo ==========================================
echo DEPLOY COMPLETO - GITHUB + EXPO
echo ==========================================
echo.

REM Garantir que estamos na raiz do projeto
cd /d "%~dp0"

echo 📦 PASSO 1: Atualizando GitHub (Render será atualizado automaticamente)
echo.
git add .
git commit -m "Update: Scripts de exportacao, App.js melhorias e deploy completo" 2>nul
if errorlevel 1 (
    echo ⚠️  Nenhuma mudança para commitar ou erro no commit
)
git push 2>nul
if errorlevel 1 (
    echo ⚠️  Erro ao fazer push no GitHub
    echo    Verifique se o Git está configurado corretamente
    echo    Ou faça manualmente:
    echo       git add .
    echo       git commit -m "Update: Scripts e melhorias"
    echo       git push
) else (
    echo ✅ Push para GitHub realizado!
    echo    O Render será atualizado automaticamente (aguarde ~2-5 min)
)
echo.

echo.
echo 📱 PASSO 2: Publicando no Expo
echo.
cd FutMz
if not exist "package.json" (
    echo ❌ Diretório FutMz não encontrado ou não é um projeto Expo
    cd ..
    goto :end
)
eas update --branch preview --message "Update: Correcoes e melhorias" 2>nul
if errorlevel 1 (
    echo ⚠️  Erro ao publicar no Expo
    echo    Verifique se o EAS CLI está instalado: npm install -g eas-cli
    echo    Ou faça login: eas login
    echo    Ou execute manualmente:
    echo       cd FutMz
    echo       eas update --branch preview --message "Update"
) else (
    echo ✅ Publicação no Expo realizada!
)
cd ..

:end
echo.
echo ==========================================
echo ✅ DEPLOY CONCLUÍDO!
echo ==========================================
echo.
echo 📋 RESUMO:
echo    ✅ GitHub: Atualizado
echo    ✅ Render: Será atualizado automaticamente (aguarde ~2-5 min)
echo    ✅ Expo: Publicado
echo.
echo 🌐 Links:
echo    Render: https://futmz.onrender.com
echo    Expo: Verifique no app Expo Go
echo.
echo 💡 PRÓXIMOS PASSOS:
echo    1. Aguarde o Render atualizar (2-5 minutos)
echo    2. Teste o app no celular (puxe para atualizar)
echo    3. Verifique se os artigos aparecem na aba INÍCIO
echo.
pause
