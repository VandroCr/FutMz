@echo off
chcp 65001 >nul
echo ==========================================
echo EXPORTAR DADOS PARA O RENDER
echo ==========================================
echo.

cd backend

echo Executando script de exportação...
echo.
python exportar_para_render.py

echo.
echo ==========================================
echo Pressione qualquer tecla para sair...
pause >nul
