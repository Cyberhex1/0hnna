@echo off
cd /d "%~dp0"
echo Deploying the 0hnna site to Cloudflare Pages...
call npx --yes wrangler pages project create 0hnna --production-branch main 2>nul
call npx --yes wrangler pages deploy . --project-name 0hnna --branch main --commit-dirty=true
pause
