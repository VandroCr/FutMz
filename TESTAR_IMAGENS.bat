@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo    🔍 TESTANDO IMAGENS DOS ARTIGOS
echo ═══════════════════════════════════════════════════════════
echo.

echo Testando imagem 1...
curl -I https://futmz.onrender.com/uploads/0a710882-1291-44af-aed4-70457ad8a086.jpg 2>nul | findstr "HTTP"
echo.

echo Testando imagem 2...
curl -I https://futmz.onrender.com/uploads/0e3195d1-1a71-47f0-9e6c-e5cba25cd413.jpg 2>nul | findstr "HTTP"
echo.

echo Testando imagem 3...
curl -I https://futmz.onrender.com/uploads/13d9f66c-c013-4984-9086-33c8374c7bee.jpg 2>nul | findstr "HTTP"
echo.

echo ═══════════════════════════════════════════════════════════
echo Resultado: Se aparecer "HTTP/1.1 200 OK", a imagem existe!
echo ═══════════════════════════════════════════════════════════
echo.
pause

