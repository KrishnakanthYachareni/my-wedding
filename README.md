# Krishna & Nandini — Wedding Invitation

A mobile-first Telugu wedding invitation website. It's plain HTML/CSS/JS with no build step, so it's ready for GitHub Pages.

| Page | What it is |
|---|---|
| `index.html` | The invitation: temple-door intro, countdown, events, rituals, pre-wedding film, live stream, sharing |
| `story.html` | Full-screen 9:16 cards for **WhatsApp Status / Instagram Story** (screenshot them, or tap *Share* to post the HD image) |

## Run locally

```bash
cd my-wedding
python3 -m http.server 8080
```

Open http://localhost:8080. To try it on your phone, use `http://<your-mac-ip>:8080` on the same Wi-Fi.
Add `?nodoor` to the URL to skip the door animation while testing.

## Common updates (edit `js/config.js` only)

- **Pre-wedding video**: set `youtube` to your video link. While it's empty, the section shows "Coming Soon".
- **Live stream**: set `liveStreamUrl` when you have it. The button turns on automatically, and a "LIVE NOW" badge shows during the event windows.
- **Music**: put an mp3 in `assets/` and set `musicUrl: "assets/music.mp3"`. It starts when the doors open.
- **siteUrl**: your GitHub Pages address. It's used in share messages and printed on the story cards.

## Deploy to GitHub Pages

1. Create a repo (e.g. `my-wedding`) and push this folder to it.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. Your site will be at `https://<username>.github.io/my-wedding/`.
4. Then, for nice WhatsApp link previews:
   - in `index.html`, change `og:image` to the full URL `https://<username>.github.io/my-wedding/assets/og-image.jpg` and fill in `og:url`
   - set `siteUrl` in `js/config.js`
   - run `./scripts/render-images.sh` to put the address on the story images, then commit & push

## Regenerating the Status / Story images

After editing `story.html` or `js/config.js`, run:

```bash
./scripts/render-images.sh
```

This uses Google Chrome in headless mode to write `assets/stories/*.png` (1080×1920) and `assets/og-image.jpg` (1200×630).
