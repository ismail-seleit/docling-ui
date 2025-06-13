#!/bin/bash
osascript -e 'tell app "Terminal"
    do script "npm start --prefix ./backend"
end tell'
osascript -e 'tell app "Terminal"
    do script "npm start --prefix ./"
end tell'
