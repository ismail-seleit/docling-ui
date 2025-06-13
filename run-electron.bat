@echo off
start "Backend" cmd /k "node backend/server.js"
start "Electron" cmd /k "npm run electron:start"
