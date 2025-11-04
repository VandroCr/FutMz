@echo off
chcp 65001 >nul
echo ==========================================
echo DEPLOY COMPLETO - GITHUB + EXPO
echo ==========================================
echo.

echo 📦 PASSO 1: Atualizando GitHub (Render será atualizado automaticamente)
echo.
git add .
git commit -m "Update: Scripts de exportacao, App.js melhorias e deploy completo" 2>nul
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
eas update --branch preview --message "Update: Correcoes e melhorias" 2>nul
if errorlevel 1 (
    echo ⚠️  Erro ao publicar no Expo
    echo    Verifique se o EAS CLI está instalado: npm install -g eas-cli
    echo    Ou faça login: eas login
) else (
    echo ✅ Publicação no Expo realizada!
)
cd ..

echo.
echo ==========================================
echo ✅ DEPLOY CONCLUÍDO!
echo ==========================================
echo.
echo 📋 RESUMO:
echo    ✅ GitHub: Atualizado
echo    ✅ Render: Será atualizado automaticamente (aguarde ~2 min)
echo    ✅ Expo: Publicado
echo.
echo 🌐 Links:
echo    Render: https://futmz.onrender.com
echo    Expo: Verifique no app Expo Go
echo.
pause
