# CAPTURE-TEST — 8x assignment

This file proves the agent-capture hook is installed and firing automatically, per
step 4 of the capture setup. Capture is verified across **two independent sessions**.

## Tool and model

- **Tool:** Claude Code (Anthropic's official CLI), running in the Claude desktop app.
- **Model:** `claude-opus-5` — confirmed from the session transcript, which is the
  ground truth. The same model plans and executes; there is no separate planner.
- **Note on an early model mismatch (honest record):** the first captured entries were
  stamped `model: claude-opus-4-8`, because the hook initially read the model from a
  hardcoded value in `.claude/agent-log.config.json`. The transcript showed responses
  actually running as `claude-opus-5`, so this was a bug. It is fixed (see below).
  The already-written entries were **left unedited** — the 8x brief says not to edit
  log entries after the fact, and this mismatch is an honest artifact of a real bug and
  its fix.

## Mechanism and files changed

Capture uses Claude Code repo-level **hooks**, which fire on their own — nothing to
remember to run.

- **Config file changed:** [`.claude/settings.json`](.claude/settings.json)
  - `UserPromptSubmit` hook → logs the verbatim prompt.
  - `Stop` hook → receives the session transcript path on stdin and logs the final
    response for that turn (and the real model name).
- **Capture script:** [`.claude/hooks/capture.mjs`](.claude/hooks/capture.mjs)
  - Writes one Markdown file per session to `.agent-logs/`.
  - Prompts and final responses only — no thinking, tool calls, or intermediate steps.
  - Appends entries; never edits or deletes them. Refreshes only the frontmatter
    counters.
- **Author/project config:** [`.claude/agent-log.config.json`](.claude/agent-log.config.json)

### The model-detection fix

Commit `fix(capture): auto-detect running model from transcript instead of hardcoding`.
The hook now reads the most recent assistant `model` from the transcript for both
prompt and response entries, so the log always reflects the model actually running.

## Where the canaries landed

Both files are in [`.agent-logs/`](.agent-logs/) and are committed (not gitignored):

- `.agent-logs/2026-09-21_17-24-49_a444ca59-4051-4764-8dc4-b686d7e08f79.md`
- `.agent-logs/2026-09-21_17-19-58_1d4fc549-9dbd-4c8c-a973-fbcb12d93d88.md`

## Canary evidence

### Session A — `a444ca59` (a second, independent session): literal canary captured as a real user prompt

    [LOG_ENTRY type=PROMPT num=1 session=a444ca59]
    timestamp: 2026-09-21T17:24:49.019Z
    model: claude-opus-4-8

    CAPTURE TEST — 8x assignment, mhr202


    [LOG_ENTRY type=RESPONSE num=1 session=a444ca59]
    timestamp: 2026-09-21T17:24:51.269Z
    model: claude-opus-5

    Got the capture test message ("8x assignment, mhr202"). I haven't run any
    commands or changed any files.

    If your capture hooks are working, this exchange should be logged under
    `.agent-logs/`. Want me to check that the entry was written?

### Session B — `1d4fc549` (the session that created the hook): every exchange auto-captured

    [LOG_ENTRY type=PROMPT num=1 session=1d4fc549]
    timestamp: 2026-09-21T17:19:58.897Z
    model: claude-opus-4-8

    WHAT DO you want from me now? git hub? or what?


    [LOG_ENTRY type=RESPONSE num=1 session=1d4fc549]
    timestamp: 2026-09-21T17:20:03.446Z
    model: claude-opus-4-8

    Just two quick text answers from you — no GitHub setup needed yet...

## Conclusion

The hook fires automatically in **two distinct sessions** (`a444ca59` and `1d4fc549`),
writing to the same committed `.agent-logs/` directory. That is exactly what the
second-session canary is meant to prove: capture is **not** session-local. Verified —
building starts from here.

## What I tried / what to know

- The hook is defined in repo-level `.claude/settings.json`, so it applies to any
  Claude Code session opened on this repo, not just the one that created it.
- The model field was hardcoded at first (bug), then switched to transcript
  auto-detection. Early entries keep the wrong stamp on purpose (no after-the-fact
  edits).
