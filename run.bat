@echo off
start "Backend" cmd /k "node backend/server.js"
start "Frontend" cmd /k "npm start --prefix ./"
