@echo off
chcp 65001 > nul
cd backend
python extrair_artigos_local.py
cd ..
pause

