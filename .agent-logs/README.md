# .agent-logs

Automatic capture of every prompt and final response from the coding agent used to
build this project, per the 8x assignment. Written by `.claude/hooks/capture.mjs`,
wired to Claude Code's `UserPromptSubmit` and `Stop` hooks in `.claude/settings.json`.

One file per session: `YYYY-MM-DD_HH-MM-SS_<session-id>.md`.
Prompts and final responses only — no thinking, tool calls, or intermediate steps.
Not gitignored. Not edited after the fact.
