@echo off
echo Adding all files to Git...
"C:\Program Files\Git\cmd\git.exe" add .

echo Committing changes...
"C:\Program Files\Git\cmd\git.exe" commit -m "Fix API connectivity issues and improve error handling"

echo Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push

echo Done!
pause 