@echo off
echo Initializing Git repository...
"C:\Program Files\Git\cmd\git.exe" init

echo Configuring Git...
"C:\Program Files\Git\cmd\git.exe" config user.name "JairajKolhatkar"
"C:\Program Files\Git\cmd\git.exe" config user.email "jairajkolhatkar@gmail.com"

echo Adding files to Git...
"C:\Program Files\Git\cmd\git.exe" add .

echo Committing changes...
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit: Learning Platform full-stack app"

echo Adding remote repository...
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/JairajKolhatkar/learning-platform.git

echo Setting main branch...
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo Done!
pause 