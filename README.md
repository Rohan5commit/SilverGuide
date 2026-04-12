# SilverGuide

SilverGuide is a senior-friendly interactive web coach that teaches everyday technology skills, scam detection, and safe AI use through guided practice and voice-assisted lessons.

## Why this matters

Many seniors want to use phones, websites, video calls, and AI tools with more confidence, but most learning tools move too fast or feel too technical. SilverGuide focuses on realistic daily tasks, scam awareness, and calm practice flows that a senior center could actually run today.

## What SilverGuide includes

- `Scam Shield`: 12 realistic scam scenarios covering fake bank texts, package alerts, password reset emails, government threats, family impersonation, gift card requests, crypto pitches, fake tech-support alerts, suspicious QR codes, fake job offers, romance scam openers, and urgent account suspension emails.
- `AI Practice`: safe prompt examples, privacy reminders, a prompt coach, and short AI-generated mini-lessons.
- `Everyday Tech Coach`: step-by-step lessons for phishing texts, fake popups, strong passwords, video calls, secure websites, suspicious download buttons, text size, and safe search.
- `Practice Mode`: one-question-at-a-time review with gentle feedback and a session summary.
- `Accessibility support`: large-text mode, screen-reader friendly structure, keyboard-accessible controls, and browser speech synthesis buttons.

## NVIDIA NIM setup

SilverGuide uses NVIDIA NIM only where it clearly adds value:

1. `Lesson Agent`
2. `Scam Explanation Agent`
3. `AI Prompt Coach Agent`
4. `Accessibility Agent`

Create a local env file from the example and leave the values blank until you are ready to connect the API:

```bash
cp .env.example .env.local
```

Set:

- `NVIDIA_NIM_API_KEY`
- `NVIDIA_NIM_MODEL` (optional, defaults to `meta/llama-3.1-8b-instruct`)

The app is resilient by design:

- If NVIDIA NIM is unavailable, SilverGuide falls back to built-in lesson and safety logic.
- If JSON parsing fails, each AI route retries once with a stricter prompt.
- The lesson flow never blocks because of AI failure.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment from GitHub

SilverGuide is optimized for GitHub-to-Vercel deployment.

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Add `NVIDIA_NIM_API_KEY` in the Vercel project settings.
4. Optionally add `NVIDIA_NIM_MODEL`.
5. Deploy.

The current build uses Next.js App Router route handlers, so Vercel is the simplest production target for this MVP.

## Architecture overview

```text
Next.js App Router
├── app/
│   ├── page routes for landing, modules, lessons, practice, summary, and about
│   └── api/ route handlers for the 4 NVIDIA NIM agents
├── components/
│   ├── senior-friendly UI sections and interactive lesson flows
│   ├── speech synthesis listen buttons
│   └── practice quiz and summary components
├── lib/
│   ├── built-in lessons, scams, and practice data
│   ├── NVIDIA NIM chat helper
│   └── fallback logic for offline or API failure scenarios
└── assets/screenshots/
    └── placeholder files for final submission captures
```

## Screenshots

Placeholder files are included in [`assets/screenshots`](./assets/screenshots).

- `01-homepage-placeholder.md`
- `02-scam-shield-placeholder.md`
- `03-ai-practice-placeholder.md`
- `04-everyday-tech-placeholder.md`
- `05-practice-summary-placeholder.md`

## Why this fits GenLink Hacks

- `Senior Citizen Impact`: it directly improves technology literacy, scam awareness, and safe AI confidence.
- `Feasibility`: it works as a senior center workshop tool with no login and built-in lesson content.
- `UI/UX`: it is designed for large tap targets, readable text, simple flows, and one primary task per screen.
- `Submission readiness`: the repo includes the required docs, placeholder screenshot assets, and a demo-ready flow.

## Future roadmap

- Add multilingual narration and translated lessons.
- Add printable take-home handouts after each session.
- Add facilitator mode for volunteers running group workshops.
- Expand the scam library with region-specific examples.
- Add optional analytics for workshop organizers without collecting sensitive learner data.
