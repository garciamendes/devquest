import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadProgress } from "@/app/actions/progress";
import {
  getTrack,
  isLessonUnlocked,
  isModuleUnlocked,
  moduleCompletion,
} from "@/lib/content";
import { emptyState, type ProgressState } from "@/lib/gamification";
import { TopBar } from "@/components/TopBar";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: trackId } = await params;
  const track = getTrack(trackId);
  if (!track) notFound();

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

  return (
    <div className="min-h-screen">
      <TopBar email={email} state={state} />

      <main className="mx-auto max-w-3xl px-5 py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-fog-dim hover:text-fog"
        >
          ← Painel
        </Link>

        <header className="mb-8 flex items-center gap-4">
          <div className="text-4xl">{track.icon}</div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-fog">
              {track.title}
            </h1>
            <p className="text-fog-dim">{track.subtitle}</p>
          </div>
        </header>

        <div className="space-y-6">
          {track.modules.map((m) => {
            const { done, total } = moduleCompletion(m, completed);
            const unlocked = isModuleUnlocked(m, completed);
            return (
              <section key={m.id} className="card overflow-hidden">
                <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                  <span className="font-mono text-sm text-fog-faint">
                    {String(m.step ?? "").padStart(2, "0")}
                  </span>
                  <span className="text-xl">{m.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display font-semibold text-fog">
                      {m.title}
                    </h2>
                    <p className="truncate text-sm text-fog-faint">
                      {m.summary}
                    </p>
                  </div>
                  <span
                    className={
                      "font-mono text-xs " +
                      (done === total && total > 0
                        ? "text-java"
                        : "text-fog-dim")
                    }
                  >
                    {done}/{total}
                  </span>
                </div>

                <ul className="divide-y divide-line/70">
                  {m.lessons.map((l) => {
                    const isDone = completed.has(l.id);
                    const unlockedLesson = isLessonUnlocked(l.id, completed);
                    const content = (
                      <div
                        className={
                          "flex items-center gap-3 px-5 py-3.5 transition " +
                          (unlockedLesson
                            ? "hover:bg-ink-700/50"
                            : "opacity-50")
                        }
                      >
                        <span
                          className={
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs " +
                            (isDone
                              ? "bg-leaf/20 text-leaf"
                              : unlockedLesson
                                ? "bg-ink-700 text-fog-dim"
                                : "bg-ink-800 text-fog-faint")
                          }
                        >
                          {isDone ? "✓" : unlockedLesson ? "›" : "🔒"}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-fog">
                          {l.title}
                        </span>
                        <span className="chip">⏱ {l.minutes}m</span>
                        <span className="font-mono text-xs text-fog-faint">
                          +{l.xp}
                        </span>
                      </div>
                    );
                    return (
                      <li key={l.id}>
                        {unlockedLesson ? (
                          <Link href={`/licao/${l.id}`} className="block">
                            {content}
                          </Link>
                        ) : (
                          <div
                            aria-disabled
                            className="block cursor-not-allowed"
                          >
                            {content}
                          </div>
                        )}
                      </li>
                    );
                  })}
                  {!unlocked && (
                    <li className="px-5 py-3 text-xs text-fog-faint">
                      Conclua o módulo anterior para desbloquear.
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
