@echo off
echo 🚀 Starting Smart Health Surveillance for Mobile Access
echo.

echo 📱 Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python app.py"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo 🌐 Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo ⏳ Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo 📱 Step 3: Find Your IP Address
echo.
ipconfig | findstr IPv4
echo.

echo 📱 Step 4: Access from Mobile
echo.
echo 1. Make sure your phone is on the same WiFi network
echo 2. Open your mobile browser
echo 3. Go to: http://YOUR_IP:8080
echo    (Replace YOUR_IP with the IP address shown above)
echo.
echo Example: http://192.168.1.100:8080
echo.

echo ✅ Both servers are now running!
echo ✅ Check the terminal windows for any errors
echo ✅ Open the URL on your mobile device
echo.

pause
