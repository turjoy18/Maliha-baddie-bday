# Happy Birthday Maliha — Collage Page

### How to view
- **Fastest**: open `index.html` in your browser (double-click it).
- **If your browser blocks local images**: run a tiny local server from this folder:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`.

### Files
- `index.html`: the page
- `styles.css`: styling (background, collage grid, notes, lightbox)
- `script.js`: builds the collage from `img1.jpeg` … `img15.jpeg` and handles shuffle + lightbox

### Deploy to Vercel
You can deploy this as a **static site** (no build step).

#### Option A: Vercel (recommended) via GitHub
- Push this folder to a GitHub repo
- In Vercel: **Add New → Project → Import** the repo
- Framework preset: choose **Other**
- Build command: **leave empty**
- Output directory: **leave empty**
- Deploy

#### Option B: Vercel CLI (from this folder)
- Install the CLI:

```bash
npm i -g vercel
```

- Login and deploy:

```bash
vercel
```

- For a production deploy:

```bash
vercel --prod
```


