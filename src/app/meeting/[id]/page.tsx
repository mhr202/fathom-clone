import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MeetingDetail } from "@/components/MeetingDetail";
import { getMeeting, MEETINGS } from "@/lib/data";

export function generateStaticParams() {
  return MEETINGS.map((m) => ({ id: m.id }));
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) notFound();

  return (
    <AppShell active="meetings">
      <MeetingDetail meeting={meeting} />
    </AppShell>
  );
}
