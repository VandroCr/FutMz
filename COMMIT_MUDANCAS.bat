@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo        PUBLICANDO MUDANÇAS PARA O GITHUB
echo ═══════════════════════════════════════════════════════════
echo.

cd FutMz
cd ..

git add FutMz/App.js FUNCIONALIDADES_TABELA_IMPLEMENTADAS.txt
git commit -m "Feat: Implementar CRUD completo de tabela e artilheiros com edicao inline"
git push

echo.
echo ✅ Mudanças publicadas com sucesso!
echo.
pause

