#!/bin/bash
echo "🚀 Starting FicSpace..."

# Start backend
cd /workspace/backend && node src/index.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend
sleep 2

# Serve frontend build
cd /workspace/frontend && npx serve dist -p 5173 --no-clipboard &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "✅ FicSpace running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"

wait
