# graph-app

## to start up project
1. start react app run 'npm start' from root directory
2. start report data api run 'json-server --watch llc.json --port 3004' from root directory
3. start maps api run 'json-server --watch maps.json --port 3003' from root directory
4. start styleguide - from root directory of styleguide (separate project) run 'npm start' 

## To include in shell script
Create a shell script (maybe in directory '/usr/local/bin' - make sure this is in your $PATH) - this will make the script globally accessible across users.

include the following in your shell script to open the project and run the startup commands in Terminal
```
osascript -e 'tell app "Terminal"
    do script "pwd"
    tell application "System Events" to keystroke "t" using command down
    tell application "System Events" to keystroke "t" using command down
    tell application "System Events" to keystroke "t" using command down
    do script "cd '"Documents/UA5/internal-apps/annual-report-app/"'" in tab 1 of window 1
    do script "npm start" in tab 1 of window 1
    do script "cd '"Documents/UA5/internal-apps/annual-report-style-guide/"'" in tab 2 of window 1
    do script "npm start" in tab 2 of window 1
    do script "cd '"Documents/UA5/internal-apps/annual-report-app/"'" in tab 3 of window 1
    do script "json-server --watch llc.json --port 3004" in tab 3 of window 1
    do script "cd '"Documents/UA5/internal-apps/annual-report-app/"'" in tab 4 of window 1
    do script "json-server --watch maps.json --port 3003" in tab 4 of window 1
end tell'
```

make the script executable by running chmod u+x [your-script.sh]

