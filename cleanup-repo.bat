@echo off
echo Removing node_modules from git repository...
"C:\Program Files\Git\cmd\git.exe" rm -r --cached */node_modules
"C:\Program Files\Git\cmd\git.exe" rm -r --cached backend/node_modules
"C:\Program Files\Git\cmd\git.exe" rm -r --cached frontend/node_modules

echo Committing changes...
"C:\Program Files\Git\cmd\git.exe" add .gitignore
"C:\Program Files\Git\cmd\git.exe" commit -m "Update .gitignore and remove node_modules from repository"

echo Pushing changes...
"C:\Program Files\Git\cmd\git.exe" push

echo Git repository cleaned up!
pause 