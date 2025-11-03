@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🔍 VERIFICANDO BANCO DE DADOS LOCAL
echo ═══════════════════════════════════════════════════════════
echo.

cd backend
python verificar_artigos.py

echo.
echo ═══════════════════════════════════════════════════════════
pause

