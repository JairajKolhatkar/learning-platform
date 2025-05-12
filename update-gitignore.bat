@echo off
echo Adding .gitignore to staging...
"C:\Program Files\Git\cmd\git.exe" add .gitignore

echo Committing changes...
"C:\Program Files\Git\cmd\git.exe" commit -m "Update .gitignore with more comprehensive rules"

echo Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push

echo Done!
pause 