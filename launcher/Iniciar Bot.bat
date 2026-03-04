@echo off
cd /d "%~dp0"
if not exist "node_modules" (
    echo A instalar dependencias, aguarda um momento...
    cmd /c npm install
)
start "" "%cd%\node_modules\electron\dist\electron.exe" "%cd%"
