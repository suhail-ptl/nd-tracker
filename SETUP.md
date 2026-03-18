# 🧠 ND Habit Tracker — Setup Guide
> Get your tracker live and accessible from all devices in ~15 minutes.

---

## What you'll set up
- **Supabase** (free) — user login + data storage that syncs across all devices
- **GitHub** (free) — hosts the app publicly at a URL you can bookmark everywhere

---

## STEP 1 — Create your Supabase database (5 min)

1. Go to **[supabase.com](https://supabase.com)** → click **Start your project** → sign up free
2. Click **New project** → give it a name like `nd-tracker` → set a database password → click **Create**
3. Wait ~1 minute for the project to spin up
4. In the left sidebar, click **SQL Editor**
5. Click **New query**, paste the entire contents of `supabase_schema.sql`, then click **Run**
6. You should see "Success. No rows returned" — your database is ready!
7. Go to **Settings → API** (left sidebar)
8. Copy two values — you'll need them in Step 3:
   - **Project URL** — looks like `https://abcxyz123.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`

> **Optional:** In Supabase → Authentication → Settings, you can turn off "Confirm email" if you don't want users to verify their email before logging in.

---

## STEP 2 — Create your GitHub repository (3 min)

1. Go to **[github.com](https://github.com)** → sign up free (or log in)
2. Click the **+** button → **New repository**
3. Name it `nd-tracker` (or anything you like)
4. Set it to **Public** *(required for free GitHub Pages hosting)*
5. Click **Create repository**
6. On the next page, click **uploading an existing file**
7. Drag and drop ALL files from the `nd-tracker-app` folder:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `supabase_schema.sql` *(optional — just for reference)*
   - `SETUP.md` *(optional — just for reference)*
8. Click **Commit changes**

---

## STEP 3 — Add your Supabase credentials (2 min)

1. In your GitHub repository, click on **`index.html`**
2. Click the **pencil icon** (Edit this file) in the top right
3. Find these two lines near the top of the `<script>` section:
   ```js
   const SUPABASE_URL  = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';
   ```
4. Replace `YOUR_SUPABASE_URL` with your Project URL from Step 1
5. Replace `YOUR_SUPABASE_ANON_KEY` with your anon key from Step 1
6. Click **Commit changes**

Example after editing:
```js
const SUPABASE_URL  = 'https://abcxyz123.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## STEP 4 — Enable GitHub Pages (2 min)

1. In your repository, click **Settings** (top tab)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Set branch to **main** and folder to **/ (root)**
5. Click **Save**
6. Wait 1–2 minutes, then refresh — your URL will appear:
   ```
   https://YOUR-GITHUB-USERNAME.github.io/nd-tracker/
   ```
7. **That's your app URL!** Bookmark it everywhere.

---

## STEP 5 — Install it as an app on your devices

### On iPhone / iPad:
1. Open the URL in **Safari** (must be Safari)
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Name it "ND Tracker" → tap **Add**
5. It now appears on your home screen like a real app!

### On Android:
1. Open the URL in **Chrome**
2. Tap the **three dots menu**
3. Tap **Add to Home screen** or **Install app**
4. Done!

### On Mac / Windows / Linux:
1. Open the URL in **Chrome** or **Edge**
2. Click the **install icon** in the address bar (looks like a screen with ↓)
3. Click **Install** — it opens in its own window like a desktop app

---

## STEP 6 — Share with friends

Just share your URL:
```
https://YOUR-USERNAME.github.io/nd-tracker/
```
Your friends open it, tap "Create account", and their data is stored privately in the same Supabase project — separate from yours. Each person's data is fully private.

---

## Enabling Notifications

1. Open your tracker in the browser
2. Go to **Settings** tab (⚙️)
3. Toggle **Daily reminder** on
4. Set your preferred time
5. When prompted, tap **Allow** to enable notifications
6. You'll get a daily nudge at your chosen time

> **Note:** On iOS, notifications require the app to be installed to your home screen first. On Android, they work from the browser too.

---

## Keeping it updated

When you want to update the app (e.g. if you get a new version from Claude):
1. Go to your GitHub repository
2. Click on `index.html` → pencil icon → paste the new code → commit
3. GitHub Pages will update automatically in 1–2 minutes

---

## FAQ

**Q: Is my data private?**
A: Yes. Each user's data is stored in Supabase with Row Level Security — no one can read another user's habits or history.

**Q: What happens if I'm offline?**
A: The app works offline! Your changes are saved locally and sync to Supabase when you're back online.

**Q: Can I use it without Supabase?**
A: Yes! If you open `index.html` before setting up Supabase, it runs in "Demo Mode" — everything saves locally to your browser. No login needed, but no sync across devices.

**Q: How do I back up my data?**
A: Go to Settings → Export all my data. This downloads a JSON file. Keep it somewhere safe.

**Q: The notifications aren't working on iOS**
A: Make sure you've installed the app to your home screen first (Step 5), then enable notifications from inside the app.

---

## Files in this folder

| File | What it does |
|------|-------------|
| `index.html` | The entire app — all HTML, CSS, and JavaScript |
| `manifest.json` | Makes it installable as a PWA (home screen app) |
| `sw.js` | Service worker — handles offline mode and notifications |
| `supabase_schema.sql` | Database tables to create in Supabase |
| `SETUP.md` | This guide |

> 💙 Built for neurodivergent and 2e minds. Progress over perfection.
