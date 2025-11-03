@echo off
echo ===================================
echo   CORRIGIR EXECUÇÃO DE SCRIPTS
echo ===================================
echo.

echo Isso vai permitir executar comandos npm/npx no PowerShell
echo.

powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

echo.
echo ✅ Corrigido! Agora você pode executar npx expo login
echo.
pause

