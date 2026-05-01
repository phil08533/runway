# Runway

A static financial planning and budgeting app: track income, expenses, and savings goals, then see how many months your savings will last.

Hosted via GitHub Pages from the `docs/` directory.

## Project structure

- `docs/index.html` – main UI
- `docs/app.js` – app logic (localStorage-backed)
- `docs/styles.css` – themes and layout
- `docs/manifest.json`, `docs/sw.js` – PWA support

## Run locally

```bash
cd docs && python3 -m http.server 8000
```

Then open http://localhost:8000.
