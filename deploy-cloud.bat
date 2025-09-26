@echo off
echo 🌐 Deploying Smart Health Surveillance to Cloud
echo.

echo 📋 Choose your deployment option:
echo.
echo 1. Railway (Recommended - FREE)
echo 2. Vercel + Railway
echo 3. Netlify + Railway
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Deploying to Railway...
    echo.
    echo Step 1: Go to https://railway.app
    echo Step 2: Sign up with GitHub
    echo Step 3: Create new project
    echo Step 4: Connect your GitHub repository
    echo Step 5: Add PostgreSQL database
    echo Step 6: Deploy automatically
    echo.
    echo ✅ Your app will be available at: https://your-app.railway.app
    echo ✅ Share this URL with your friends!
)

if "%choice%"=="2" (
    echo.
    echo 🚀 Deploying to Vercel + Railway...
    echo.
    echo Frontend (Vercel):
    echo Step 1: Go to https://vercel.com
    echo Step 2: Sign up with GitHub
    echo Step 3: Import your repository
    echo Step 4: Deploy automatically
    echo.
    echo Backend (Railway):
    echo Step 1: Go to https://railway.app
    echo Step 2: Create new project
    echo Step 3: Add PostgreSQL database
    echo Step 4: Deploy backend
    echo.
    echo ✅ Frontend: https://your-app.vercel.app
    echo ✅ Backend: https://your-backend.railway.app
    echo ✅ Share the Vercel URL with your friends!
)

if "%choice%"=="3" (
    echo.
    echo 🚀 Deploying to Netlify + Railway...
    echo.
    echo Frontend (Netlify):
    echo Step 1: Go to https://netlify.com
    echo Step 2: Sign up with GitHub
    echo Step 3: Import your repository
    echo Step 4: Deploy automatically
    echo.
    echo Backend (Railway):
    echo Step 1: Go to https://railway.app
    echo Step 2: Create new project
    echo Step 3: Add PostgreSQL database
    echo Step 4: Deploy backend
    echo.
    echo ✅ Frontend: https://your-app.netlify.app
    echo ✅ Backend: https://your-backend.railway.app
    echo ✅ Share the Netlify URL with your friends!
)

echo.
echo 📱 After deployment:
echo 1. Get your deployment URL
echo 2. Share with your friends
echo 3. They can access it from anywhere!
echo 4. Works on any device (phone, tablet, computer)
echo.

pause
