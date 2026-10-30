# 0hnna

My portfolio: games and tools for Windows, the Steam Deck, Fire TV and the browser.

Live at **https://0hnna.pages.dev**

## What's here

- `index.html` – the home page with every project, the status board and the dev log
- `syspeek.html`, `roll-zero0.html` – project pages
- `img/` – project icons, screenshots and covers
- `functions/dl/[project]/[platform].js` – the download buttons. `/dl/olympia/windows` asks GitHub for the newest release and sends the visitor straight to that file, so the buttons never need updating when a new version ships. If GitHub doesn't answer, it falls back to the last known file name.

## Deploying

Double-click `deploy.cmd`, or run:

```
npx wrangler pages deploy . --project-name 0hnna --branch main
```

## Adding a download

Add the project to `PROJECTS` in `functions/dl/[project]/[platform].js` with a pattern that matches its release file, then point the button at `/dl/<project>/<platform>`.
