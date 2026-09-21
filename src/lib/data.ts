import { Meeting, Participant } from "./types";

// --- Reusable participant definitions -------------------------------------------------
const P = {
  sarah: { name: "Sarah Chen", initials: "SC", role: "Product Lead", color: "bg-rose-500" },
  john: { name: "John Alvarez", initials: "JA", role: "Account Exec", color: "bg-amber-500" },
  mike: { name: "Mike Ross", initials: "MR", role: "Engineering", color: "bg-emerald-500" },
  priya: { name: "Priya Nair", initials: "PN", role: "Design", color: "bg-violet-500" },
  tom: { name: "Tom Becker", initials: "TB", role: "Customer", color: "bg-sky-500" },
  lena: { name: "Lena Ortiz", initials: "LO", role: "CEO", color: "bg-fuchsia-500" },
  dev: { name: "Dev (you)", initials: "ME", role: "Engineer", color: "bg-brand-600" },
  raj: { name: "Raj Patel", initials: "RP", role: "Data", color: "bg-teal-500" },
  amy: { name: "Amy Wong", initials: "AW", role: "Marketing", color: "bg-orange-500" },
  carlos: { name: "Carlos Diaz", initials: "CD", role: "Sales", color: "bg-indigo-500" },
} satisfies Record<string, Participant>;

// Dates are computed relative to "now" so the dashboard always feels fresh.
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}
function daysAgo(d: number, atHour = 10): string {
  const date = new Date(Date.now() - d * 86_400_000);
  date.setHours(atHour, 0, 0, 0);
  return date.toISOString();
}

export const MEETINGS: Meeting[] = [
  {
    id: "weekly-team-sync",
    title: "Weekly Team Sync",
    date: hoursAgo(3),
    durationSec: 45 * 60,
    platform: "Zoom",
    category: "Team",
    sentiment: "positive",
    participants: [P.sarah, P.mike, P.priya, P.dev],
    keywords: ["roadmap", "Q3", "export feature", "onboarding", "hiring"],
    summary: [
      "The team reviewed Q3 roadmap progress; onboarding revamp is on track for next sprint.",
      "Customers keep asking for a CSV export feature — it was bumped up the priority list.",
      "Two engineering interviews are scheduled this week; Mike will run the system-design round.",
    ],
    actionItems: [
      { id: "a1", task: "Spec the CSV export feature", owner: "Priya Nair", due: "Fri", done: false },
      { id: "a2", task: "Finalize onboarding copy", owner: "Sarah Chen", due: "Wed", done: true },
      { id: "a3", task: "Prep system-design interview", owner: "Mike Ross", due: "Thu", done: false },
    ],
    highlights: [
      { id: "h1", timestamp: 320, text: "Customer requested CSV export — third time this month.", by: "Sarah Chen" },
      { id: "h2", timestamp: 1180, text: "Onboarding revamp cut signup drop-off by 12% in the beta.", by: "Dev (you)" },
    ],
    transcript: [
      { id: "t1", speaker: "Sarah Chen", start: 12, text: "Let's start with the roadmap. Where are we on the onboarding revamp?" },
      { id: "t2", speaker: "Priya Nair", start: 28, text: "Design is done. The beta cut signup drop-off by about 12 percent." },
      { id: "t3", speaker: "Mike Ross", start: 61, text: "Engineering can ship it next sprint if we freeze scope now." },
      { id: "t4", speaker: "Sarah Chen", start: 300, text: "One more thing — a customer asked for CSV export again. That's the third time this month." },
      { id: "t5", speaker: "Dev (you)", start: 330, text: "I'll pull the usage data, but I think we should bump it up." },
      { id: "t6", speaker: "Priya Nair", start: 355, text: "I can spec it by Friday." },
      { id: "t7", speaker: "Mike Ross", start: 1150, text: "Interviews are Thursday. I'll take the system-design round." },
    ],
  },
  {
    id: "client-discovery-northwind",
    title: "Client Discovery — Northwind Co.",
    date: daysAgo(1, 14),
    durationSec: 42 * 60,
    platform: "Google Meet",
    category: "Sales",
    sentiment: "mixed",
    participants: [P.john, P.sarah, P.tom],
    keywords: ["pricing", "reporting", "integration", "timeline", "budget"],
    summary: [
      "Northwind wants better reporting and a Salesforce integration before they commit budget.",
      "Pricing was a sticking point — they pushed back on per-seat pricing for a 40-person team.",
      "They need a decision by end of quarter; John to send a tailored proposal.",
    ],
    actionItems: [
      { id: "a1", task: "Send tailored pricing proposal", owner: "John Alvarez", due: "Friday", done: false },
      { id: "a2", task: "Share reporting roadmap one-pager", owner: "Sarah Chen", due: "Wed", done: false },
      { id: "a3", task: "Schedule technical integration call", owner: "John Alvarez", done: false },
    ],
    highlights: [
      { id: "h1", timestamp: 480, text: "\"We can't move forward without better reporting.\" — key blocker.", by: "John Alvarez" },
      { id: "h2", timestamp: 1520, text: "Budget concern: per-seat pricing at 40 seats is a hard sell.", by: "John Alvarez" },
    ],
    transcript: [
      { id: "t1", speaker: "John Alvarez", start: 20, text: "Thanks for the time, Tom. What's driving the evaluation right now?" },
      { id: "t2", speaker: "Tom Becker", start: 45, text: "Honestly, reporting. Our current tool can't give us the dashboards leadership wants." },
      { id: "t3", speaker: "Tom Becker", start: 470, text: "We can't move forward without better reporting. That's the whole point." },
      { id: "t4", speaker: "Sarah Chen", start: 520, text: "That's fair. We're shipping a reporting revamp this quarter — I can share the roadmap." },
      { id: "t5", speaker: "Tom Becker", start: 1500, text: "The other thing is pricing. Per-seat for 40 people gets expensive fast." },
      { id: "t6", speaker: "John Alvarez", start: 1540, text: "Understood. Let me put together a proposal that works for a team your size." },
    ],
  },
  {
    id: "all-hands-q3",
    title: "Q3 All-Hands & Planning",
    date: daysAgo(2, 9),
    durationSec: 61 * 60,
    platform: "Microsoft Teams",
    category: "Company",
    sentiment: "positive",
    // The 8-person, hour-long meeting the brief says is the case that actually matters.
    participants: [P.lena, P.sarah, P.mike, P.priya, P.raj, P.amy, P.carlos, P.dev],
    keywords: ["revenue", "churn", "hiring plan", "north star", "AI roadmap", "retention"],
    summary: [
      "Revenue is up 28% QoQ; net retention crossed 110% for the first time.",
      "Churn is concentrated in sub-10-seat accounts — the team will test a lighter self-serve tier.",
      "AI roadmap for Q4 centers on automatic action-item detection and smarter search.",
      "Hiring plan adds three engineers and one designer; Lena stressed keeping the bar high.",
    ],
    actionItems: [
      { id: "a1", task: "Draft self-serve tier proposal", owner: "Sarah Chen", due: "Next Tue", done: false },
      { id: "a2", task: "Publish Q4 AI roadmap doc", owner: "Dev (you)", due: "Fri", done: false },
      { id: "a3", task: "Open 3 eng + 1 design roles", owner: "Lena Ortiz", done: false },
      { id: "a4", task: "Build churn cohort dashboard", owner: "Raj Patel", due: "End of month", done: false },
      { id: "a5", task: "Plan retention email campaign", owner: "Amy Wong", done: false },
    ],
    highlights: [
      { id: "h1", timestamp: 240, text: "Net retention crossed 110% — a company first.", by: "Lena Ortiz" },
      { id: "h2", timestamp: 1360, text: "Churn is almost entirely in sub-10-seat accounts.", by: "Raj Patel" },
      { id: "h3", timestamp: 2600, text: "Q4 AI theme: auto action-items + semantic search.", by: "Dev (you)" },
      { id: "h4", timestamp: 3200, text: "\"Keep the hiring bar high even when we're moving fast.\"", by: "Lena Ortiz" },
    ],
    transcript: [
      { id: "t1", speaker: "Lena Ortiz", start: 30, text: "Big quarter. Revenue is up 28 percent, and net retention crossed 110 for the first time." },
      { id: "t2", speaker: "Raj Patel", start: 1340, text: "The churn story is interesting — it's almost entirely sub-10-seat accounts." },
      { id: "t3", speaker: "Sarah Chen", start: 1400, text: "So a lighter self-serve tier could plug that. I'll draft a proposal." },
      { id: "t4", speaker: "Dev (you)", start: 2580, text: "For Q4 AI, I want to focus on automatic action-item detection and semantic search across meetings." },
      { id: "t5", speaker: "Amy Wong", start: 2900, text: "Marketing can support with a retention campaign once the tier is live." },
      { id: "t6", speaker: "Carlos Diaz", start: 3050, text: "Sales is seeing the same thing — small accounts want self-serve, big ones want white-glove." },
      { id: "t7", speaker: "Lena Ortiz", start: 3180, text: "Let's keep the hiring bar high even when we're moving fast. Three engineers, one designer." },
      { id: "t8", speaker: "Priya Nair", start: 3320, text: "I'll help interview the design candidate." },
    ],
  },
  {
    id: "1-1-mike",
    title: "1:1 — Dev & Mike",
    date: daysAgo(3, 15),
    durationSec: 28 * 60,
    platform: "Zoom",
    category: "1:1",
    sentiment: "positive",
    participants: [P.dev, P.mike],
    keywords: ["career growth", "tech lead", "feedback", "workload"],
    summary: [
      "Mike wants to grow toward a tech-lead role; agreed to own the search subsystem as a stretch.",
      "Workload is high but sustainable; we'll revisit after the export feature ships.",
      "Positive feedback on how Mike mentored the two new hires.",
    ],
    actionItems: [
      { id: "a1", task: "Hand off search subsystem ownership to Mike", owner: "Dev (you)", done: false },
      { id: "a2", task: "Draft tech-lead growth plan", owner: "Mike Ross", due: "Next 1:1", done: false },
    ],
    highlights: [
      { id: "h1", timestamp: 200, text: "Mike is ready for more scope — tech-lead track.", by: "Dev (you)" },
    ],
    transcript: [
      { id: "t1", speaker: "Mike Ross", start: 40, text: "I'd like to start moving toward a tech-lead role this year." },
      { id: "t2", speaker: "Dev (you)", start: 190, text: "You're ready for more scope. Want to own the search subsystem?" },
      { id: "t3", speaker: "Mike Ross", start: 230, text: "Yes — that'd be a great stretch. I'll draft a growth plan." },
    ],
  },
  {
    id: "eng-interview-frontend",
    title: "Interview — Senior Frontend Candidate",
    date: daysAgo(4, 11),
    durationSec: 55 * 60,
    platform: "Google Meet",
    category: "Hiring",
    sentiment: "positive",
    participants: [P.priya, P.mike, P.dev],
    keywords: ["React", "system design", "accessibility", "hire signal"],
    summary: [
      "Strong candidate — deep React knowledge and a real focus on accessibility.",
      "Handled the component-architecture question well; slight gap on backend trade-offs.",
      "Panel leaning hire; one more reference check recommended.",
    ],
    actionItems: [
      { id: "a1", task: "Complete reference check", owner: "Priya Nair", due: "Mon", done: false },
      { id: "a2", task: "Write up panel feedback in ATS", owner: "Dev (you)", due: "Today", done: true },
    ],
    highlights: [
      { id: "h1", timestamp: 900, text: "Excellent accessibility instincts — unprompted ARIA discussion.", by: "Priya Nair" },
      { id: "h2", timestamp: 2100, text: "Minor gap: backend trade-offs under load.", by: "Mike Ross" },
    ],
    transcript: [
      { id: "t1", speaker: "Priya Nair", start: 60, text: "Walk us through how you'd structure a large component library." },
      { id: "t2", speaker: "Mike Ross", start: 890, text: "Nice — they brought up ARIA and keyboard nav without prompting." },
      { id: "t3", speaker: "Dev (you)", start: 2090, text: "One gap was backend trade-offs when the API is the bottleneck." },
    ],
  },
  {
    id: "customer-feedback-acme",
    title: "Customer Feedback — Acme Corp",
    date: daysAgo(6, 13),
    durationSec: 37 * 60,
    platform: "Zoom",
    category: "Customer",
    sentiment: "tense",
    participants: [P.sarah, P.tom, P.dev],
    keywords: ["bugs", "reliability", "mobile app", "support"],
    summary: [
      "Acme is frustrated with reliability — two outages last month hurt trust.",
      "They love the core product but the mobile app is a recurring pain point.",
      "Requested a dedicated support channel; sentiment recoverable if reliability improves.",
    ],
    actionItems: [
      { id: "a1", task: "Set up dedicated Slack support channel", owner: "Sarah Chen", due: "This week", done: false },
      { id: "a2", task: "Share reliability improvement plan", owner: "Dev (you)", due: "Fri", done: false },
      { id: "a3", task: "Prioritize mobile app crash fixes", owner: "Dev (you)", done: false },
    ],
    highlights: [
      { id: "h1", timestamp: 300, text: "\"Two outages last month — that's what worries leadership.\"", by: "Sarah Chen" },
      { id: "h2", timestamp: 1400, text: "Mobile app is the top source of complaints.", by: "Tom Becker" },
    ],
    transcript: [
      { id: "t1", speaker: "Tom Becker", start: 40, text: "Look, we like the product, but two outages last month is what worries leadership." },
      { id: "t2", speaker: "Sarah Chen", start: 310, text: "That's on us. I'll share our reliability plan and set up a dedicated support channel." },
      { id: "t3", speaker: "Tom Becker", start: 1390, text: "And the mobile app — that's where most of our complaints come from." },
      { id: "t4", speaker: "Dev (you)", start: 1430, text: "We'll prioritize the crash fixes this sprint." },
    ],
  },
];

export function getMeetings(): Meeting[] {
  return [...MEETINGS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getMeeting(id: string): Meeting | undefined {
  return MEETINGS.find((m) => m.id === id);
}

export function getHighlight(meetingId: string, highlightId: string) {
  const meeting = getMeeting(meetingId);
  const highlight = meeting?.highlights.find((h) => h.id === highlightId);
  return meeting && highlight ? { meeting, highlight } : undefined;
}
