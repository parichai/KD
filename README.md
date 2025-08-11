# Kawasaki Disease Visual Algorithm Web App

An interactive, color‑coded tool to map Kawasaki Disease (KD) **risk levels** to **follow‑up**, **testing**, **advanced coronary imaging**, and **therapy**. Built for rapid teaching and bedside reference. Adapted from the AHA 2024 Scientific Statement (Table 2). Educational use only.

## Features

- Input **maximal Z score** and **coronary status** (current vs regressed, and to what)
- Auto‑suggests the **AHA risk class** (editable)
- Color‑coded **visual algorithm** and **matrix view**
- One‑click **Print/Save to PDF** and **Copy Plan**

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components (Button, Card, Input, Label, Select)
- **lucide-react** icons

## Quick Start

### 0) Requirements

- Node.js 18+ (or 20+)
- npm
- GitHub + Vercel accounts

### 1) Create the project

```bash
npx create-next-app@latest kd-visual --ts --tailwind
cd kd-visual
```

### 2) Install UI dependencies

```bash
npm i lucide-react
npx shadcn@latest init -d
npx shadcn@latest add button card input label select
```

### 3) Add the app code

Replace the contents of `app/page.tsx` with the code from this repository’s `app/page.tsx`.

### 4) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:

- Entering a Z score updates the suggested risk automatically.
- Changing status (current/regressed and target state) updates the subclass.

## Deploy to Vercel

1. Push this project to GitHub (see steps below).
2. Go to [https://vercel.com](https://vercel.com) → **New Project** → **Import GitHub Repo** → select your repo.
3. Vercel auto‑detects Next.js. Keep defaults and **Deploy**.
4. You’ll get a live URL when the build finishes.

## Push to GitHub

```bash
git init
git add -A
git commit -m "KD Visual Algorithm App"
git branch -M main
# replace <your-username>
git remote add origin https://github.com/<your-username>/kd-visual.git
git push -u origin main
```

## Project Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # start production server locally
```

## File Structure (key parts)

```
kd-visual/
├─ app/
│  └─ page.tsx        # KD visual algorithm UI (this repo’s main file)
├─ components/
│  └─ ui/             # shadcn/ui components (button, card, input, label, select)
├─ styles/
│  └─ globals.css     # Tailwind setup
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

## Data & Guidance Notes

- Logic and schedules are adapted from the **AHA 2024** KD long‑term management table.
- This tool is for **education and quick reference**. It does **not** replace clinical guidelines or individualized care.

## Troubleshooting

- **Module not found: '@/components/ui/...':** Ensure you ran `shadcn init` and added components: `button card input label select`.
- **Tailwind styles missing:** In `tailwind.config.ts`, confirm `content` includes:
  ```ts
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"]
  ```
- **Build fails on Vercel:** Open the Vercel build logs; check for missing deps or typos in import paths.

## License

Piyawat Arichai with ChatGPT 5

## Acknowledgments

- American Heart Association (AHA) Scientific Statement on Kawasaki Disease, 2024.
