import type { MeetingDTO } from "./dto";

export type TemplateSection = { heading: string; bullets: string[] };

export type SummaryTemplate = {
  key: string;
  label: string;
  description: string;
  render: (m: MeetingDTO) => TemplateSection[];
};

// The same meeting, re-framed for different readers. Switching template changes the
// lens, never the underlying record.
export const TEMPLATES: SummaryTemplate[] = [
  {
    key: "general",
    label: "General",
    description: "Balanced overview of what was discussed and decided.",
    render: (m) => [
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
    description: "Deal-shaped: pain, blockers, and the path to close.",
    render: (m) => [
      { heading: "Customer pain", bullets: m.highlights.map((h) => h.text) },
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
    description: "Personal and growth-oriented.",
    render: (m) => [
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
    description: "Signal-focused notes for a hiring decision.",
    render: (m) => [
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
    description: "Product view: requests, blockers, sentiment.",
    render: (m) => [
      { heading: "Requests & pain", bullets: m.highlights.map((h) => h.text) },
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
