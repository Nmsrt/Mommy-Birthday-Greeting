# Happy Birthday, Mommy 🎂

A scrapbook birthday card, made for phones, shown one page at a time. She taps an envelope to open it, swipes (or taps Next) through the pages, reads the letter, then taps the candles to blow them out. Plain HTML/CSS/JS: no build step, no backend.

```
index.html     page shell + link-preview tags
styles.css     layout and animation
app.js         page engine (envelope, page turns, chat, scoreboard, cake, confetti)
content.js     ← ALL the text, photos, music. Edit this one.
photos/        your photos go here
```

## 1. Edit the content

Open `content.js` in any text editor.

- **Text**: change anything inside the `"quotes"`.
- **Pages**: each `{ ... }` block in `sections` is one page. Reorder, delete, or copy-paste blocks. Keep the comma between blocks.
- **Card types**: `panic` (meter + chips), `chat` (good-morning messages), `volleyball` (scoreboard), `visa` (passport stamps + thank you), `dish` (photo + thank you), `iou` (gift promise ticket), `letter`, `cake` (tap candles → confetti).
- **Skip the envelope while editing**: open `index.html?open`. Jump to page 5: `index.html?open&p=5`.

If the page turns blank after an edit, you probably broke a comma or a quote. Undo your last change and try again.

## 2. Add photos

Two photos, both in `photos/` (resize to ~1200px wide first so they load fast on mobile data):

| File | Where it shows |
|---|---|
| `photos/Photo.jpg` | First page polaroid (portrait crop) |
| `photos/sinigang.jpg` | Sinigang na baboy page |

Change the `photo` path in `content.js` if your filenames differ. Filenames are case-sensitive once online: `Mommy.JPG` ≠ `mommy.jpg`. A missing photo shows a soft gradient with ♥ / 🍲 instead.

## 3. Music

`song.mp3` sits next to `index.html`, and `content.js` points to it with `music: { src: "song.mp3" }`. To swap songs, replace the file (keep the name) or change `src`. Set `src: ""` to turn music off.

Music starts when she taps the envelope (phones only allow audio after a tap). A round ♪ button in the top-right pauses and resumes it. `volume` (0 to 1) sets loudness; default 0.6. The song loops.

## 4. Deploy for free (under 5 minutes)

### Option A: Netlify Drop (easiest)

1. Go to <https://app.netlify.com/drop>.
2. Drag this whole folder onto the page.
3. You get a link like `https://random-name-123.netlify.app`. Make a free account to keep it permanently and rename it, for example to `happy-birthday-mommy.netlify.app`.
4. To update later, open your site in Netlify, go to **Deploys**, and drag the folder in again.

### Option B: GitHub Pages

1. Create a new public repo on GitHub, for example `happy-birthday-mommy`.
2. Upload all the files (**Add file → Upload files**, then drag everything in) and commit.
3. Go to **Settings → Pages**. Under **Source**, pick **Deploy from a branch**, then choose `main` and `/ (root)`, and click Save.
4. After about a minute the site is live at `https://YOUR-USERNAME.github.io/happy-birthday-mommy/`.

All paths are relative, so the site works on a GitHub Pages subfolder too.

## 5. Link preview (Messenger / Viber)

The preview title and description live in `index.html` as the `og:title` and `og:description` tags. Link previewers don't run JavaScript, so these can't go in `content.js`.

To add a preview image:

1. Add `photos/og-cover.jpg`. A 1200×630 image works best.
2. Uncomment the `og:image` line in `index.html` and put your **full** site URL in it.
3. Messenger caches previews. If you already sent the link, you can force a refresh at <https://developers.facebook.com/tools/debug/>.

## Interactions

- **Envelope**: tap to open (starts music if set).
- **Pages**: swipe left/right, or use the Next / ← buttons at the bottom (← → keys on desktop). A tall page (the letter) scrolls up/down inside itself. The panic meter, chat, scoreboard, and stamps animate when their page opens.
- **IOU ticket**: tap to stamp "PROMISE".
- **Cake**: tap each candle to blow it out; all out → confetti + birthday message. "Light them again" resets.
- If the phone has **Reduce motion** on, everything shows instantly with no confetti.
