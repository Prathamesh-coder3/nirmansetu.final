@echo off
setlocal
title NirmaanSetu
echo ==========================================
echo        NirmaanSetu - Starting...
echo ==========================================
echo.
echo This launcher starts Spring Boot with the
echo lock-free H2 development database.
cd /d "%~dp0backend"
call mvn clean spring-boot:run
if errorlevel 1 (
  echo.
  echo NirmaanSetu failed to start.
  echo Check the terminal output above.
  pause
)
endlocal
