# Notably — AI Meeting Notetaker

A rebuild of an AI meeting-notetaker (Fathom-style) for the 8x assignment. Built in one
sitting with Next.js. **Live demo:** _(add your Vercel URL here)_

Notably is the layer that matters *after* a meeting ends: the recording turns into a
searchable transcript, an AI summary you can re-frame per audience, tracked action
items, highlighted moments, and shareable clips for people who weren't on the call.

---

## The one decision that shaped everything

> I intentionally focused on the **post-meeting intelligence workflow** rather than
> building the recording infrastructure. The capture layer (bot join, audio capture,
> transcription) is **mocked with realistic seeded meeting data**, because the
> assignment's goal was to demonstrate product thinking, UX decisions, and scalable
> application design — not to reimplement a Zoom bot in 24 hours. The brief explicitly
> allows stubbing the capture layer.

That freed the time to make the parts a user actually touches every day feel real:
the meeting list, the summary, the action items, search, playback-synced transcript,
and sharing.

## What's built

- **Dashboard** — all meetings with live search (title, people, topics, summary),
  category filters, sentiment tags, and per-meeting action-item / highlight counts.
- **Meeting detail** (the core screen):
  - Simulated **player** with a scrubbable timeline and highlight markers.
  - **Transcript that follows playback** — the active line highlights and auto-scrolls;
    click any line (or highlight, or marker) to jump.
  - **AI summary with 5 templates** (General, Sales, 1:1, Interview, Customer feedback) —
    switching a template re-frames the same meeting for a different audience.
  - **Action items** you can check off, with owners and due dates.
  - **Highlights** you can jump to or share individually.
- **New meeting flow** — upload/record UI with a simulated transcribe → summarize →
  extract-action-items pipeline.
- **Public share pages** — `/share/<meeting>` (full recap) and
  `/share/<meeting>/<highlight>` (a single moment with transcript context). These open
  for anyone, signed in or not.
- **Seeded with real data** — 6 meetings including an 8-person, 1-hour all-hands (the
  case the brief says actually matters).

## Tech stack & architecture

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** for styling; a small inline SVG icon set (no icon dependency)
- Clean separation: a typed **domain model + data-access layer**
  (`src/lib/`) feeding server components, with focused client components for the
  interactive surfaces (player, search, template switch).

Meeting pages are statically generated; the data layer (`src/lib/data.ts`) is a seeded
in-memory store deliberately kept behind small accessor functions
(`getMeetings`, `getMeeting`, …) so it could be swapped for Postgres/Prisma without
touching the UI. For a 24-hour build judged on product and UX, a seeded store makes the
**live link bulletproof** (no database to provision or keep alive) while preserving a
clean, real data model.

### Trade-offs I made on purpose

- **No auth wall.** The app runs as a demo account so the live link works for anyone —
  a requirement in the brief. Real auth (NextAuth/JWT) is a known, low-risk add.
- **Mocked capture & AI.** Summaries/action items are seeded structured data, not live
  LLM calls. In production these come from the transcription + an LLM summarization step.
- **Client-side state for interactions** (checking action items, playback). A production
  version persists these to the backend.

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

## `.agent-logs/` — how this was built

Every prompt and final response from the coding agent (Claude Code) is captured
automatically to [`.agent-logs/`](.agent-logs/) via repo hooks in
[`.claude/settings.json`](.claude/settings.json). See
[`CAPTURE-TEST.md`](CAPTURE-TEST.md) for the verification. The logs are committed and
public on purpose — dead ends and all.

## Project structure

```
src/
  app/
    page.tsx                     # dashboard
    meeting/[id]/page.tsx        # meeting detail
    share/[meetingId]/...        # public share pages
  components/                    # AppShell, MeetingDetail, MeetingsBrowser, …
  lib/
    types.ts                     # domain model + formatters
    data.ts                      # seeded meetings (accessor layer)
    templates.ts                 # summary templates
```
