This small site contains two pages implemented as sections: the main (home) and projects. Projects is intentionally left empty.

Files:
- `index.html` — single HTML that contains both sections (`#home` and `#projects`).
- `styles.css` — visual styles and background.
- `script.js` — smooth scroll and history handling to update URL to `/` and `/projects`.

How to open locally (Windows):
1. Open the folder `c:\Users\almaz\web` in your browser or VS Code.
2. Open `index.html` in a browser. For proper history behavior visit via a simple local server.

Quick local server (PowerShell):
```powershell
# from c:\Users\almaz\web
python -m http.server 8000; Start-Process http://localhost:8000
```

Notes:
- The site purposely uses a textured dark background and an abstract blurred shape instead of the original photo.
- Navigation uses the History API to show `/projects` in URL while smoothly scrolling to the section.
