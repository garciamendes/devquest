import { notFound, redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadProgress } from "@/app/actions/progress";
import { getLesson, nextLessonId, isLessonUnlocked } from "@/lib/content";
import { emptyState, type ProgressState } from "@/lib/gamification";
import { TopBar } from "@/components/TopBar";
import { LessonView } from "@/components/LessonView";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: lessonId } = await params;
  const loc = getLesson(lessonId);
  if (!loc) notFound();

  let email: string | null = null;
  let state: ProgressState = emptyState;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
    state = await loadProgress();
  }

  const completed = new Set(state.completedLessons);

  // Keep progression linear: bounce locked lessons back to the track.
  if (!isLessonUnlocked(lessonId, completed)) {
    redirect(`/trilha/${loc.track.id}`);
  }

  const next = nextLessonId(lessonId);

  return (
    <div className="min-h-screen">
      <TopBar email={email} state={state} />
      <LessonView
        lesson={loc.lesson}
        accent={loc.track.accent}
        trackTitle={loc.track.title}
        initialState={state}
        nextHref={next ? `/licao/${next}` : null}
        backHref={`/trilha/${loc.track.id}`}
      />
    </div>
  );
}
