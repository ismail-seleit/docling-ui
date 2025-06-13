#!/bin/bash
# Get the absolute path of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Open new terminal windows and execute commands in the correct directory
osascript -e "tell app \"Terminal\"
    do script \"cd '$SCRIPT_DIR' && npm start --prefix ./backend\"
end tell"

osascript -e "tell app \"Terminal\"
    do script \"cd '$SCRIPT_DIR' && npm start --prefix ./\"
end tell"
