<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Zenfolio OS

Public portfolio site with no auth flow and no private token handling.

## Run Locally

**Prerequisites:** Node.js + pnpm

1. Install dependencies:
   `pnpm install`
2. Run the app:
   `pnpm dev`
3. Open:
   `http://localhost:3000`

## Production Notes

1. Deploy to Vercel from this repo root.
2. This app is static and public; no runtime secret configuration is required.

## Choose Which Projects Are Public

Only projects with `featured: true` in `/Users/yide/project/zenfolio/constants.ts` (`ALL_VERCEL_PROJECTS`) are displayed.

To include/exclude a project:
1. Find the project in `ALL_VERCEL_PROJECTS`.
2. Set `featured: true` to show it publicly, `false` to hide it.
3. Redeploy.

## Sync From Vercel

To fetch your current Vercel projects and generate an updated list template:

1. Run:
   `VERCEL_TOKEN=your_token_here pnpm sync:vercel`
2. Open:
   `/Users/yide/project/zenfolio/scripts/vercel-projects.snapshot.json`
3. Copy the printed TypeScript block into `constants.ts`, then mark only public projects with `featured: true`.
