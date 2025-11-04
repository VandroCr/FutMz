@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    📤 PUBLICAR NO GITHUB
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo Verificando status...
git status --short

echo.
echo Adicionando todos os arquivos...
git add .

echo.
echo Fazendo commit...
set /p commit_msg="Digite a mensagem do commit (ou Enter para usar padrão): "
if "%commit_msg%"=="" set commit_msg=Update: Atualização do projeto

git commit -m "%commit_msg%"

echo.
echo Enviando para o GitHub...
git push

if %errorlevel% equ 0 (
    echo.
    echo ✅ Arquivos enviados com sucesso!
    echo.
    echo ⚠️  LEMBRE-SE: O Render vai fazer deploy automaticamente (~5 min)
) else (
    echo.
    echo ❌ Erro ao fazer push!
    echo    Verifique sua conexão e credenciais do Git
)

echo.
pause

