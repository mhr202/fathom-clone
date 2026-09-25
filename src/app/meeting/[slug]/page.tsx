import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { MeetingWorkspace } from "@/components/MeetingWorkspace";
import { getMeetingBySlug } from "@/lib/queries";
import { toMeetingDTO } from "@/lib/dto";

export const dynamic = "force-dynamic";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meeting = await getMeetingBySlug(slug);
  if (!meeting) notFound();

  return (
    <Shell active="meetings">
      <MeetingWorkspace meeting={toMeetingDTO(meeting)} />
    </Shell>
  );
}
