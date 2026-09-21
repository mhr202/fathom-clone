import { Meeting, SummaryTemplate } from "./types";

// Templates re-frame the same meeting for different audiences. Switching a template
// changes the shape of the summary, not the underlying transcript — the product signal
// the assignment specifically calls out.
export const TEMPLATES: SummaryTemplate[] = [
  {
    key: "general",
    label: "General",
    description: "Balanced overview of what was discussed and decided.",
    render: (m: Meeting) => [
      { heading: "Overview", bullets: m.summary },
      {
        heading: "Decisions & next steps",
        bullets: m.actionItems.map((a) => `${a.task} — ${a.owner}`),
      },
    ],
  },
  {
    key: "sales",
    label: "Sales call",
    description: "MEDDIC-style framing for revenue conversations.",
    render: (m: Meeting) => [
      {
        heading: "Customer pain",
        bullets: m.highlights.map((h) => h.text),
      },
      {
        heading: "Next steps to close",
        bullets: m.actionItems.map((a) =>
          a.due ? `${a.task} (by ${a.due}) — ${a.owner}` : `${a.task} — ${a.owner}`
        ),
      },
      { heading: "Context", bullets: m.summary.slice(0, 2) },
    ],
  },
  {
    key: "one_on_one",
    label: "1:1",
    description: "Personal, growth-oriented recap.",
    render: (m: Meeting) => [
      { heading: "Talking points", bullets: m.summary },
      {
        heading: "Commitments",
        bullets: m.actionItems.map((a) => `${a.owner}: ${a.task}`),
      },
    ],
  },
  {
    key: "interview",
    label: "Interview",
    description: "Signal-focused notes for hiring decisions.",
    render: (m: Meeting) => [
      { heading: "Signals", bullets: m.highlights.map((h) => h.text) },
      { heading: "Summary", bullets: m.summary },
      {
        heading: "Follow-ups",
        bullets: m.actionItems.map((a) => `${a.task} — ${a.owner}`),
      },
    ],
  },
  {
    key: "customer_feedback",
    label: "Customer feedback",
    description: "Product-team view: requests, blockers, sentiment.",
    render: (m: Meeting) => [
      {
        heading: "Feature requests & pain",
        bullets: m.highlights.map((h) => h.text),
      },
      { heading: "What we heard", bullets: m.summary },
      {
        heading: "Actions for the team",
        bullets: m.actionItems.map((a) => `${a.task} — ${a.owner}`),
      },
    ],
  },
];

export function getTemplate(key: string): SummaryTemplate {
  return TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[0];
}
