# Roots & Morphology — marketing website

A static one-page site (plain HTML, CSS and JavaScript — no build step).

```
website/
  index.html   page content
  styles.css   design tokens, layout, light/dark themes
  motion.css   modern layer: glass nav, aurora hero, spotlight cards, ribbon, tilt, animations
  script.js    theme toggle, mobile menu, scroll reveal, "Break a word apart" demo
  assets/      app icon and author photo
```

## Preview

Open `index.html` in any browser.

## Publish

Upload the whole `website` folder to any static host, for example Netlify (drag and drop
the folder at app.netlify.com/drop), Vercel, GitHub Pages or Cloudflare Pages.

## Things to check before publishing

- **Download link** — the "Get it on Google Play" button points to
  `https://play.google.com/store/apps/details?id=com.rootsandmorphology.app` (the app's
  package name). Change it in `index.html` if the store listing uses a different address.
- **Demo terms** — the four examples in "Break a word apart" are in `script.js` (`TERMS`).
