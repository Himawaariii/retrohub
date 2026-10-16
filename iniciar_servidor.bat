@echo off
title Servidor RetroHub
cd /d "%~dp0"
echo ===================================================
echo     Iniciando Servidor Local RetroHub...
echo     Red de companeros: http://retrohub.local
echo ===================================================
echo.
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] No se pudo iniciar con Python. Comprueba que Python este instalado.
    pause
)
