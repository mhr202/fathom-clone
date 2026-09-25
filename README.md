# Rec — meeting intelligence

A rebuild of the AI meeting-notetaker idea (Fathom as reference, not blueprint), with a
frontend I designed myself and a real backend behind it.

**Repository:** https://github.com/mhr202/fathom-clone

Rec is the part of a meeting tool that actually earns its keep: what happens *after* the
call. A searchable transcript on a timeline, a summary you can re-frame per audience,
commitments tracked across every meeting, and moments you can share with people who
weren't in the room.

---

## The backend is real

No mock data, no hardcoded responses.

- **Postgres (Neon)** accessed through **Prisma**
- Five related tables: `Meeting`, `Participant`, `ActionItem`, `Highlight`,
  `TranscriptSegment` — see [`prisma/schema.prisma`](prisma/schema.prisma)
- A real REST API under [`src/app/api`](src/app/api):

| Method | Route | Does |
|---|---|---|
| `GET` | `/api/meetings?q=&category=` | Lists meetings; **search and filter run as SQL in Postgres** |
| `POST` | `/api/meetings` | Creates a meeting row |
| `GET` | `/api/meetings/[slug]` | One meeting with all relations |
| `PATCH` | `/api/action-items/[id]` | Toggles completion — **persists** |
| `POST` | `/api/meetings/[slug]/highlights` | Inserts a highlight at the playhead |

Things that write to the database in the UI: ticking an action item, capturing a moment
during playback, creating a meeting. Reload the page and the change is still there,
because it's in Postgres.

Search is genuinely server-side: typing in the search box issues a request that queries
across titles, categories, keywords, participant names **and transcript text**.

## The frontend is my own design

The brief asked for my design choices rather than a copy, so I didn't reproduce Fathom's
light-SaaS look. Rec is a **dark editorial workspace**:

- Near-black canvas, serif display type, one acid-lime accent used sparingly
- **Timeline-first.** Every meeting row carries a miniature timeline showing transcript
  density and where the notable moments sit — you can read the *shape* of a meeting
  before opening it. Inside a meeting that timeline becomes the primary control.
- **Transcript is the main column**, not a side panel — the summary and commitments sit
  in a rail beside it. That inverts the usual layout, because the transcript is what you
  actually go back for.
- **A dedicated Action items view** that cuts across meetings and groups commitments by
  owner. This doesn't exist in the original; it's the thing I'd want most.

### What I cut, and why

- **No auth wall.** A demo account keeps shared links and the app openable by anyone.
  Real auth is well-understood and wasn't what was being judged.
- **Capture and transcription are stubbed.** Creating a meeting writes a real row, and
  the progress steps narrate what a production pipeline would do, but there is no bot
  joining calls. The brief allowed this; building a Zoom bot would have cost the entire
  budget and shown less.
- **Summaries are stored text, not live LLM output.** The template system re-frames the
  stored record for different readers. Swapping in a real summarization call is one
  function behind the same interface.

## Run it locally

```bash
npm install
```

Create `.env` with a Postgres connection string:

```bash
DATABASE_URL="postgresql://…"   # pooled
DIRECT_URL="postgresql://…"     # direct, for migrations
```

```bash
npx prisma db push   # create the tables
npm run db:seed      # load sample meetings
npm run dev          # http://localhost:3000
```

## Structure

```
prisma/
  schema.prisma          # the data model
  seed.ts                # loads real rows into Postgres
src/
  app/
    page.tsx             # meetings index
    actions/             # commitments across all meetings
    meeting/[slug]/      # the workspace
    share/[slug]/…       # public, unauthenticated share pages
    api/…                # REST API
  components/            # Shell, MeetingWorkspace, MeetingsList, …
  lib/
    db.ts                # Prisma client
    queries.ts           # all database access
    dto.ts               # JSON contract shared by API + server components
    templates.ts         # summary lenses
```

## `.agent-logs/`

Every prompt and final response from the coding agent is captured automatically to
[`.agent-logs/`](.agent-logs/) by repo hooks in
[`.claude/settings.json`](.claude/settings.json). Verification is in
[`CAPTURE-TEST.md`](CAPTURE-TEST.md). Committed as the work happened — dead ends
included.
