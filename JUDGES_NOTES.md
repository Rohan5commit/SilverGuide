# Judges Notes

## Senior Citizen Impact

- SilverGuide focuses on real high-frequency pain points for older adults: suspicious texts, fake popups, passwords, video calls, safe search, and basic AI use.
- The app teaches skills that improve independence, reduce scam risk, and make daily technology use less stressful.
- The tone is respectful and confidence-building instead of childish or overly technical.

## Feasibility

- The MVP requires no login and ships with built-in lessons and sample scam content.
- It can run in a browser on shared laptops, desktops, or tablets in a senior center.
- NVIDIA NIM features are additive rather than required, so the app remains useful even if AI is unavailable.
- The workshop flow is realistic for staff, volunteers, or family members supporting small groups.

## UI and UX Design

- Large touch targets and readable text are the default.
- Every page is left-aligned, uncluttered, and centered on one main action at a time.
- Lessons are broken into short steps instead of long paragraphs.
- There is an optional large-text mode and browser-based voice playback.
- Practice Mode uses encouraging feedback and avoids harsh testing language.

## Requirements Coverage

- Web app built with Next.js, Tailwind CSS, and Lucide icons.
- Deployable directly from GitHub to Vercel.
- Uses NVIDIA NIM for the 4 required agents:
  - Lesson Agent
  - Scam Explanation Agent
  - AI Prompt Coach Agent
  - Accessibility Agent
- Includes all requested pages:
  - Landing page
  - Module picker
  - Scam Shield
  - AI Practice
  - Everyday Tech Coach
  - Practice Mode
  - Session Summary
  - About / How to use
- Includes the required repo deliverables:
  - `README.md`
  - `DEMO_SCRIPT.md`
  - `JUDGES_NOTES.md`
  - `SENIOR_CENTER_PILOT.md`
  - `assets/screenshots/` placeholders
- Includes the required content:
  - 12 scam examples
  - built-in lessons for phishing text, fake tech support popup, safe AI use, stronger passwords, joining a video call, secure websites, and suspicious download buttons
  - replayable practice flow with end-of-session summary
