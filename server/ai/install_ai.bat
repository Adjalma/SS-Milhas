@echo off
echo Instalando dependencias do sistema de IA...
py -3.11 -m pip install --upgrade pip
py -3.11 -m pip install -r requirements.txt
echo.
echo Instalacao concluida!
echo.
echo Para testar o sistema, execute:
echo py -3.11 start_ai_system.py
pause
