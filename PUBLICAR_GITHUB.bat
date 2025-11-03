@echo off
chcp 65001 > nul
echo ===================================
echo   PUBLICAR PROJETO FUTMZ NO GITHUB
echo ===================================
echo.

:: Verificar se o Git está instalado
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Git não está instalado!
    echo.
    echo Por favor, baixe e instale o Git de: https://git-scm.com/downloads
    echo Após instalar, execute este script novamente.
    pause
    exit /b 1
)

echo [OK] Git encontrado!
echo.

:: Navegar para o diretório do projeto
cd /d "%~dp0"
echo Diretório atual: %CD%
echo.

:: Verificar se já é um repositório Git
if exist .git (
    echo [INFO] Repositório Git já existe.
    echo.
) else (
    echo [INFO] Inicializando repositório Git...
    git init
    echo [OK] Repositório Git inicializado!
    echo.
)

:: Adicionar todos os arquivos
echo [INFO] Adicionando arquivos...
git add .
echo [OK] Arquivos adicionados!
echo.

:: Fazer commit
echo [INFO] Fazendo commit...
git commit -m "Initial commit: FutMz - Aplicativo de Futebol Moçambicano" || (
    echo [AVISO] Nenhuma alteração para commitar ou commit já existe.
    echo.
)

:: Verificar se o remote existe
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Remote 'origin' já existe.
    git remote -v
    echo.
    set /p resposta="Deseja atualizar o remote? (s/n): "
    if /i "%resposta%"=="s" (
        git remote remove origin
        git remote add origin https://github.com/VandroCr/FutMz.git
        echo [OK] Remote atualizado!
        echo.
    )
) else (
    echo [INFO] Adicionando remote 'origin'...
    git remote add origin https://github.com/VandroCr/FutMz.git
    echo [OK] Remote adicionado!
    echo.
)

:: Renomear branch para 'main' (se necessário)
git branch -M main 2>nul

:: Fazer push
echo [INFO] Enviando código para o GitHub...
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo   PROJETO PUBLICADO COM SUCESSO!
    echo ===================================
    echo.
    echo Acesse: https://github.com/VandroCr/FutMz
) else (
    echo.
    echo [ERRO] Falha ao fazer push!
    echo.
    echo Possíveis causas:
    echo - Repositório não existe no GitHub
    echo - Falta de permissão
    echo - Necessidade de autenticação
    echo.
    echo Solução:
    echo 1. Certifique-se de que o repositório existe em: https://github.com/VandroCr/FutMz
    echo 2. Se necessário, crie o repositório no GitHub primeiro
    echo 3. Tente executar os comandos manualmente:
    echo    git push -u origin main
    echo.
)

echo.
pause

