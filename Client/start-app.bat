@echo off
setlocal

REM Set project paths
set "BACKEND_PATH=C:\Users\Administrator\Desktop\Project\MovieTicketBookingSystem\node-backend"
set "FRONTEND_PATH=C:\Users\Administrator\Desktop\Project\MovieTicketBookingSystem\react-frontend"

echo ========================================
echo Killing processes on ports 3000 and 3001
echo ========================================

REM Kill process on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing PID %%a on port 3000
    taskkill /F /PID %%a
)

REM Kill process on port 3001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo Killing PID %%a on port 3001
    taskkill /F /PID %%a
)

echo.
echo ==========================
echo Installing backend modules
echo ==========================
cd /d "%BACKEND_PATH%"
call npm install

echo Starting backend server on port 3001...
start "Backend Server" cmd /k "cd /d %BACKEND_PATH% && npm start"

echo.
echo ==========================
echo Installing frontend modules
echo ==========================
cd /d "%FRONTEND_PATH%"
call npm install

echo Starting frontend server on port 3000...
start "Frontend App" cmd /k "cd /d %FRONTEND_PATH% && npm start"

echo.
echo All servers started with logs visible.
endlocal
