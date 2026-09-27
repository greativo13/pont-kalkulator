@echo off
cd /d "%~dp0"
git add index.html
git commit -m "frissites"
git push
echo.
echo Kesz! A link 1-2 percen belul frissul.
pause
