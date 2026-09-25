// Source content used ONLY by the seed script to populate the real database.
// The running app never reads this — it queries Postgres through Prisma.

export type SeedParticipant = {
  name: string;
  initials: string;
  role?: string;
  color: string;
};

export type SeedMeeting = {
  slug: string;
  title: string;
  date: Date;
  durationSec: number;
  platform: string;
  category: string;
  sentiment: string;
  keywords: string[];
  summary: string[];
  participants: SeedParticipant[];
  actionItems: { task: string; owner: string; due?: string; done: boolean }[];
  highlights: { timestamp: number; text: string; by: string }[];
  transcript: { speaker: string; start: number; text: string }[];
};

const P = {
  sarah: { name: "Sarah Chen", initials: "SC", role: "Product Lead", color: "rose" },
  john: { name: "John Alvarez", initials: "JA", role: "Account Exec", color: "amber" },
  mike: { name: "Mike Ross", initials: "MR", role: "Engineering", color: "emerald" },
  priya: { name: "Priya Nair", initials: "PN", role: "Design", color: "violet" },
  tom: { name: "Tom Becker", initials: "TB", role: "Customer", color: "sky" },
  lena: { name: "Lena Ortiz", initials: "LO", role: "CEO", color: "fuchsia" },
  dev: { name: "Dev (you)", initials: "ME", role: "Engineer", color: "accent" },
  raj: { name: "Raj Patel", initials: "RP", role: "Data", color: "teal" },
  amy: { name: "Amy Wong", initials: "AW", role: "Marketing", color: "orange" },
  carlos: { name: "Carlos Diaz", initials: "CD", role: "Sales", color: "indigo" },
} satisfies Record<string, SeedParticipant>;

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 3600_000);
}
function daysAgo(d: number, atHour = 10): Date {
  const date = new Date(Date.now() - d * 86_400_000);
  date.setUTCHours(atHour, 0, 0, 0);
  return date;
}

export const SEED_MEETINGS: SeedMeeting[] = [
  {
    slug: "weekly-team-sync",
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
      { task: "Spec the CSV export feature", owner: "Priya Nair", due: "Fri", done: false },
      { task: "Finalize onboarding copy", owner: "Sarah Chen", due: "Wed", done: true },
      { task: "Prep system-design interview", owner: "Mike Ross", due: "Thu", done: false },
    ],
    highlights: [
      { timestamp: 320, text: "Customer requested CSV export — third time this month.", by: "Sarah Chen" },
      { timestamp: 1180, text: "Onboarding revamp cut signup drop-off by 12% in the beta.", by: "Dev (you)" },
    ],
    transcript: [
      { speaker: "Sarah Chen", start: 12, text: "Let's start with the roadmap. Where are we on the onboarding revamp?" },
      { speaker: "Priya Nair", start: 28, text: "Design is done. The beta cut signup drop-off by about 12 percent." },
      { speaker: "Mike Ross", start: 61, text: "Engineering can ship it next sprint if we freeze scope now." },
      { speaker: "Sarah Chen", start: 300, text: "One more thing — a customer asked for CSV export again. That's the third time this month." },
      { speaker: "Dev (you)", start: 330, text: "I'll pull the usage data, but I think we should bump it up." },
      { speaker: "Priya Nair", start: 355, text: "I can spec it by Friday." },
      { speaker: "Mike Ross", start: 1150, text: "Interviews are Thursday. I'll take the system-design round." },
    ],
  },
  {
    slug: "client-discovery-northwind",
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
      { task: "Send tailored pricing proposal", owner: "John Alvarez", due: "Friday", done: false },
      { task: "Share reporting roadmap one-pager", owner: "Sarah Chen", due: "Wed", done: false },
      { task: "Schedule technical integration call", owner: "John Alvarez", done: false },
    ],
    highlights: [
      { timestamp: 480, text: "\"We can't move forward without better reporting.\" — key blocker.", by: "John Alvarez" },
      { timestamp: 1520, text: "Budget concern: per-seat pricing at 40 seats is a hard sell.", by: "John Alvarez" },
    ],
    transcript: [
      { speaker: "John Alvarez", start: 20, text: "Thanks for the time, Tom. What's driving the evaluation right now?" },
      { speaker: "Tom Becker", start: 45, text: "Honestly, reporting. Our current tool can't give us the dashboards leadership wants." },
      { speaker: "Tom Becker", start: 470, text: "We can't move forward without better reporting. That's the whole point." },
      { speaker: "Sarah Chen", start: 520, text: "That's fair. We're shipping a reporting revamp this quarter — I can share the roadmap." },
      { speaker: "Tom Becker", start: 1500, text: "The other thing is pricing. Per-seat for 40 people gets expensive fast." },
      { speaker: "John Alvarez", start: 1540, text: "Understood. Let me put together a proposal that works for a team your size." },
    ],
  },
  {
    slug: "all-hands-q3",
    title: "Q3 All-Hands & Planning",
    date: daysAgo(2, 9),
    durationSec: 61 * 60,
    platform: "Microsoft Teams",
    category: "Company",
    sentiment: "positive",
    participants: [P.lena, P.sarah, P.mike, P.priya, P.raj, P.amy, P.carlos, P.dev],
    keywords: ["revenue", "churn", "hiring plan", "north star", "AI roadmap", "retention"],
    summary: [
      "Revenue is up 28% QoQ; net retention crossed 110% for the first time.",
      "Churn is concentrated in sub-10-seat accounts — the team will test a lighter self-serve tier.",
      "AI roadmap for Q4 centers on automatic action-item detection and smarter search.",
      "Hiring plan adds three engineers and one designer; Lena stressed keeping the bar high.",
    ],
    actionItems: [
      { task: "Draft self-serve tier proposal", owner: "Sarah Chen", due: "Next Tue", done: false },
      { task: "Publish Q4 AI roadmap doc", owner: "Dev (you)", due: "Fri", done: false },
      { task: "Open 3 eng + 1 design roles", owner: "Lena Ortiz", done: false },
      { task: "Build churn cohort dashboard", owner: "Raj Patel", due: "End of month", done: false },
      { task: "Plan retention email campaign", owner: "Amy Wong", done: false },
    ],
    highlights: [
      { timestamp: 240, text: "Net retention crossed 110% — a company first.", by: "Lena Ortiz" },
      { timestamp: 1360, text: "Churn is almost entirely in sub-10-seat accounts.", by: "Raj Patel" },
      { timestamp: 2600, text: "Q4 AI theme: auto action-items + semantic search.", by: "Dev (you)" },
      { timestamp: 3200, text: "\"Keep the hiring bar high even when we're moving fast.\"", by: "Lena Ortiz" },
    ],
    transcript: [
      { speaker: "Lena Ortiz", start: 30, text: "Big quarter. Revenue is up 28 percent, and net retention crossed 110 for the first time." },
      { speaker: "Raj Patel", start: 1340, text: "The churn story is interesting — it's almost entirely sub-10-seat accounts." },
      { speaker: "Sarah Chen", start: 1400, text: "So a lighter self-serve tier could plug that. I'll draft a proposal." },
      { speaker: "Dev (you)", start: 2580, text: "For Q4 AI, I want to focus on automatic action-item detection and semantic search across meetings." },
      { speaker: "Amy Wong", start: 2900, text: "Marketing can support with a retention campaign once the tier is live." },
      { speaker: "Carlos Diaz", start: 3050, text: "Sales is seeing the same thing — small accounts want self-serve, big ones want white-glove." },
      { speaker: "Lena Ortiz", start: 3180, text: "Let's keep the hiring bar high even when we're moving fast. Three engineers, one designer." },
      { speaker: "Priya Nair", start: 3320, text: "I'll help interview the design candidate." },
    ],
  },
  {
    slug: "1-1-mike",
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
      { task: "Hand off search subsystem ownership to Mike", owner: "Dev (you)", done: false },
      { task: "Draft tech-lead growth plan", owner: "Mike Ross", due: "Next 1:1", done: false },
    ],
    highlights: [
      { timestamp: 200, text: "Mike is ready for more scope — tech-lead track.", by: "Dev (you)" },
    ],
    transcript: [
      { speaker: "Mike Ross", start: 40, text: "I'd like to start moving toward a tech-lead role this year." },
      { speaker: "Dev (you)", start: 190, text: "You're ready for more scope. Want to own the search subsystem?" },
      { speaker: "Mike Ross", start: 230, text: "Yes — that'd be a great stretch. I'll draft a growth plan." },
    ],
  },
  {
    slug: "eng-interview-frontend",
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
      { task: "Complete reference check", owner: "Priya Nair", due: "Mon", done: false },
      { task: "Write up panel feedback in ATS", owner: "Dev (you)", due: "Today", done: true },
    ],
    highlights: [
      { timestamp: 900, text: "Excellent accessibility instincts — unprompted ARIA discussion.", by: "Priya Nair" },
      { timestamp: 2100, text: "Minor gap: backend trade-offs under load.", by: "Mike Ross" },
    ],
    transcript: [
      { speaker: "Priya Nair", start: 60, text: "Walk us through how you'd structure a large component library." },
      { speaker: "Mike Ross", start: 890, text: "Nice — they brought up ARIA and keyboard nav without prompting." },
      { speaker: "Dev (you)", start: 2090, text: "One gap was backend trade-offs when the API is the bottleneck." },
    ],
  },
  {
    slug: "customer-feedback-acme",
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
      { task: "Set up dedicated Slack support channel", owner: "Sarah Chen", due: "This week", done: false },
      { task: "Share reliability improvement plan", owner: "Dev (you)", due: "Fri", done: false },
      { task: "Prioritize mobile app crash fixes", owner: "Dev (you)", done: false },
    ],
    highlights: [
      { timestamp: 300, text: "\"Two outages last month — that's what worries leadership.\"", by: "Sarah Chen" },
      { timestamp: 1400, text: "Mobile app is the top source of complaints.", by: "Tom Becker" },
    ],
    transcript: [
      { speaker: "Tom Becker", start: 40, text: "Look, we like the product, but two outages last month is what worries leadership." },
      { speaker: "Sarah Chen", start: 310, text: "That's on us. I'll share our reliability plan and set up a dedicated support channel." },
      { speaker: "Tom Becker", start: 1390, text: "And the mobile app — that's where most of our complaints come from." },
      { speaker: "Dev (you)", start: 1430, text: "We'll prioritize the crash fixes this sprint." },
    ],
  },
];
