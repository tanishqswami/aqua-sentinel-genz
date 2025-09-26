#!/bin/bash

echo "🚀 Starting Smart Health Surveillance for Mobile Access"
echo

echo "📱 Step 1: Starting Backend Server..."
cd backend && python app.py &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

echo "🌐 Step 2: Starting Frontend Server..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo "⏳ Waiting for frontend to start..."
sleep 5

echo
echo "📱 Step 3: Find Your IP Address"
echo
ifconfig | grep "inet " | grep -v 127.0.0.1
echo

echo "📱 Step 4: Access from Mobile"
echo
echo "1. Make sure your phone is on the same WiFi network"
echo "2. Open your mobile browser"
echo "3. Go to: http://YOUR_IP:8080"
echo "   (Replace YOUR_IP with the IP address shown above)"
echo
echo "Example: http://192.168.1.100:8080"
echo

echo "✅ Both servers are now running!"
echo "✅ Press Ctrl+C to stop both servers"
echo "✅ Open the URL on your mobile device"
echo

# Wait for user to stop
wait
