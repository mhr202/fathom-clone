import { PrismaClient } from "@prisma/client";
import { SEED_MEETINGS } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // Idempotent: clear and reload. Cascades remove children.
  await prisma.meeting.deleteMany();

  for (const m of SEED_MEETINGS) {
    const created = await prisma.meeting.create({
      data: {
        slug: m.slug,
        title: m.title,
        date: m.date,
        durationSec: m.durationSec,
        platform: m.platform,
        category: m.category,
        sentiment: m.sentiment,
        keywords: m.keywords,
        summary: m.summary,
        participants: { create: m.participants },
        actionItems: { create: m.actionItems },
        highlights: { create: m.highlights },
        transcript: { create: m.transcript },
      },
    });
    console.log(`  ✓ ${created.title}`);
  }

  const counts = {
    meetings: await prisma.meeting.count(),
    participants: await prisma.participant.count(),
    actionItems: await prisma.actionItem.count(),
    highlights: await prisma.highlight.count(),
    transcript: await prisma.transcriptSegment.count(),
  };
  console.log("Done:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
