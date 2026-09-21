#!/usr/bin/env node
/*
 * 8x assignment — agent capture hook.
 *
 * Wired to two Claude Code lifecycle events in .claude/settings.json:
 *   - UserPromptSubmit -> logs the verbatim prompt
 *   - Stop             -> reads the session transcript and logs the final response
 *
 * Writes one Markdown file per session to .agent-logs/, in the exact format 8x asked
 * for. Prompts and final responses only — no thinking, no tool calls, no intermediate
 * steps. Entries are appended, never edited or deleted after the fact.
 */

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Read hook payload from stdin (Claude Code sends a JSON object).
// ---------------------------------------------------------------------------
function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function main() {
  const raw = readStdin();
  let input = {};
  try {
    input = JSON.parse(raw || "{}");
  } catch {
    input = {};
  }

  const projectDir =
    process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const logDir = path.join(projectDir, ".agent-logs");
  fs.mkdirSync(logDir, { recursive: true });

  // Load author/project config if present.
  let cfg = { author: "unknown", project: path.basename(projectDir) };
  try {
    const cfgPath = path.join(projectDir, ".claude", "agent-log.config.json");
    if (fs.existsSync(cfgPath)) {
      cfg = { ...cfg, ...JSON.parse(fs.readFileSync(cfgPath, "utf8")) };
    }
  } catch {}

  const sessionId = input.session_id || "unknown-session";
  const shortId = sessionId.slice(0, 8);
  const event = input.hook_event_name || process.argv[2] || "";

  // Find (or create) this session's log file: <date>_<time>_<session-id>.md
  const existing = fs
    .readdirSync(logDir)
    .filter((f) => f.endsWith(`_${sessionId}.md`));
  let filePath;
  if (existing.length) {
    filePath = path.join(logDir, existing[0]);
  } else {
    const stamp = new Date()
      .toISOString()
      .replace(/[:]/g, "-")
      .replace(/\..+/, "")
      .replace("T", "_");
    filePath = path.join(logDir, `${stamp}_${sessionId}.md`);
  }

  const nowIso = new Date().toISOString();

  if (event === "UserPromptSubmit") {
    const prompt = (input.prompt ?? "").toString();
    if (!prompt.trim()) return;
    // Detect the real model from the transcript rather than trusting a hardcoded
    // value — the running model can differ from config, and the log must be honest.
    const model =
      input.model ||
      latestAssistantModel(input.transcript_path) ||
      cfg.model ||
      "unknown";
    appendEntry(filePath, {
      type: "PROMPT",
      shortId,
      sessionId,
      cfg,
      model,
      timestamp: nowIso,
      body: prompt,
    });
  } else if (event === "Stop" || event === "SubagentStop") {
    const { text, model, timestamp } = extractFinalResponse(
      input.transcript_path
    );
    appendEntry(filePath, {
      type: "RESPONSE",
      shortId,
      sessionId,
      cfg,
      model: model || "claude-opus-4-8",
      timestamp: timestamp || nowIso,
      body: text || "(no text response captured for this turn)",
      pairWithPrompt: true,
    });
  }
}

// ---------------------------------------------------------------------------
// Read the most recent assistant model name from a transcript (JSONL), so prompt
// entries are stamped with the model that is actually running.
// ---------------------------------------------------------------------------
function latestAssistantModel(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return "";
  let lines;
  try {
    lines = fs.readFileSync(transcriptPath, "utf8").split("\n").filter(Boolean);
  } catch {
    return "";
  }
  let model = "";
  for (const line of lines) {
    try {
      const e = JSON.parse(line);
      if (e.type === "assistant" && e.message && e.message.model) {
        model = e.message.model;
      }
    } catch {}
  }
  return model;
}

// ---------------------------------------------------------------------------
// Pull the final assistant text for the most recent turn out of the transcript.
// The transcript is JSONL; tool results arrive as user-type messages, so a
// "real" prompt is a user message whose content is plain text.
// ---------------------------------------------------------------------------
function extractFinalResponse(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    return { text: "", model: "", timestamp: "" };
  }
  let lines;
  try {
    lines = fs.readFileSync(transcriptPath, "utf8").split("\n").filter(Boolean);
  } catch {
    return { text: "", model: "", timestamp: "" };
  }

  const entries = [];
  for (const line of lines) {
    try {
      entries.push(JSON.parse(line));
    } catch {}
  }

  // Index of the last genuine user prompt (not a tool_result carrier).
  let lastPromptIdx = -1;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.type !== "user" || !e.message) continue;
    const c = e.message.content;
    const isText =
      typeof c === "string" ||
      (Array.isArray(c) &&
        c.some((p) => p && p.type === "text") &&
        !c.some((p) => p && p.type === "tool_result"));
    if (isText) lastPromptIdx = i;
  }

  const texts = [];
  let model = "";
  let timestamp = "";
  for (let i = lastPromptIdx + 1; i < entries.length; i++) {
    const e = entries[i];
    if (e.type !== "assistant" || !e.message) continue;
    if (e.message.model) model = e.message.model;
    if (e.timestamp) timestamp = e.timestamp;
    const c = e.message.content;
    if (Array.isArray(c)) {
      for (const p of c) {
        if (p && p.type === "text" && p.text && p.text.trim()) {
          texts.push(p.text.trim());
        }
      }
    } else if (typeof c === "string" && c.trim()) {
      texts.push(c.trim());
    }
  }

  return { text: texts.join("\n\n"), model, timestamp };
}

// ---------------------------------------------------------------------------
// Append an entry and refresh the frontmatter counters. Existing entries are
// never touched.
// ---------------------------------------------------------------------------
function appendEntry(filePath, entry) {
  let body = "";
  if (fs.existsSync(filePath)) {
    const full = fs.readFileSync(filePath, "utf8");
    const m = full.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    body = m ? m[1] : full;
  } else {
    const header =
      `# Session Log - ${entry.timestamp.slice(0, 10)}\n\n` +
      `Session: \`${entry.shortId}\` | Project: \`${entry.cfg.project}\` | Author: \`${entry.cfg.author}\`\n\n---\n`;
    body = "\n" + header;
  }

  // Number this entry.
  const promptCount = (body.match(/\[LOG_ENTRY type=PROMPT /g) || []).length;
  const responseCount = (body.match(/\[LOG_ENTRY type=RESPONSE /g) || [])
    .length;

  if (entry.type === "RESPONSE" && entry.pairWithPrompt) {
    // One response per prompt; skip stray Stop events with nothing new.
    if (responseCount >= promptCount) return;
  }

  const num =
    entry.type === "PROMPT" ? promptCount + 1 : Math.max(responseCount + 1, 1);

  const block =
    `\n[LOG_ENTRY type=${entry.type} num=${num} session=${entry.shortId}]\n` +
    `timestamp: ${entry.timestamp}\n` +
    `model: ${entry.model}\n\n` +
    `${entry.body}\n\n`;

  body += block;

  // Recompute frontmatter from the body's PROMPT timestamps.
  const promptTimes = [
    ...body.matchAll(/\[LOG_ENTRY type=PROMPT [^\]]*\]\ntimestamp: ([^\n]+)/g),
  ].map((mm) => mm[1]);
  const totalExchanges = promptTimes.length;
  const firstTime = promptTimes[0] || entry.timestamp;
  const lastTime = promptTimes[promptTimes.length - 1] || entry.timestamp;

  const frontmatter =
    `---\n` +
    `session_id: ${entry.sessionId}\n` +
    `date: ${firstTime.slice(0, 10)}\n` +
    `author: ${entry.cfg.author}\n` +
    `model: ${entry.model || entry.cfg.model}\n` +
    `tool: claude-code\n` +
    `project: ${entry.cfg.project}\n` +
    `total_exchanges: ${totalExchanges}\n` +
    `first_prompt_time: ${firstTime}\n` +
    `last_prompt_time: ${lastTime}\n` +
    `---\n`;

  fs.writeFileSync(filePath, frontmatter + body, "utf8");
}

main();
