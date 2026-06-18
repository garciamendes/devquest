import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loadProgress } from "@/app/actions/progress";
import {
  tracks,
  getTrack,
  trackCompletion,
  totalLessons,
} from "@/lib/content";
import type { Track } from "@/lib/content/types";
import {
  emptyState,
  levelProgress,
  rankTitle,
  BADGES,
  type ProgressState,
} from "@/lib/gamification";
import { Staircase } from "@/components/Staircase";
import { TopBar } from "@/components/TopBar";

export const dynamic = "force-dynamic";

const ACCENT_TEXT: Record<string, string> = {
  java: "text-java",
  go: "text-go",
  english: "text-fog",
  backend: "text-leaf",
  ai: "text-go",
};

function continueLessonId(completed: Set<string>): string | null {
  const java = getTrack("java");
  if (!java) return null;
  let prevCompleted = true;
  for (const m of java.modules) {
    for (const l of m.lessons) {
      const unlocked = prevCompleted; // linear unlock within the track
      if (unlocked && !completed.has(l.id)) return l.id;
      prevCompleted = completed.has(l.id);
    }
  }
  return null;
}

export default async function Dashboard() {
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
  const lp = levelProgress(state.xp);
  const continueId = continueLessonId(completed);
  const earnedBadges = new Set(state.badges);

  const otherTracks = tracks.filter((t) => t.id !== "java");
  const java = getTrack("java")!;

  return (
    <div className="min-h-screen">
      <TopBar email={email} state={state} />

      <main className="mx-auto max-w-5xl px-5 py-8">
        {/* Hero */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-fog-dim">
              Nível {lp.level} · {rankTitle(lp.level)}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-fog">
              {state.streak > 0
                ? `Ofensiva de ${state.streak} dia${state.streak > 1 ? "s" : ""} 🔥`
                : "Vamos começar a subir 🚀"}
            </h1>
            <p className="mt-1 text-fog-dim">
              {lp.toNext > 0
                ? `Faltam ${lp.toNext} XP para o nível ${lp.level + 1}.`
                : "Você chegou ao topo desta faixa de XP."}
            </p>
          </div>
          {continueId && (
            <Link href={`/licao/${continueId}`} className="btn-primary">
              {state.completedLessons.length > 0 ? "Continuar" : "Começar"} →
            </Link>
          )}
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="XP total" value={`${state.xp}`} accent="text-java" />
          <Stat
            label="Ofensiva atual"
            value={`${state.streak}d`}
            accent="text-go"
          />
          <Stat
            label="Melhor ofensiva"
            value={`${state.bestStreak}d`}
            accent="text-fog"
          />
          <Stat
            label="Lições"
            value={`${state.completedLessons.length}/${totalLessons()}`}
            accent="text-leaf"
          />
        </section>

        {/* Staircase */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">☕</span>
            <h2 className="font-display text-xl font-semibold text-fog">
              Jornada Java
            </h2>
            <span className="font-mono text-xs text-fog-faint">
              {trackCompletion(java, completed).done}/
              {trackCompletion(java, completed).total}
            </span>
          </div>
          <div className="card p-5 sm:p-7">
            <Staircase track={java} completed={completed} />
          </div>
        </section>

        {/* Other tracks */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-fog">
            Outras trilhas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherTracks.map((t) => (
              <TrackCard key={t.id} track={t} completed={completed} />
            ))}
          </div>
        </section>

        {/* Badges */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-fog">
            Conquistas{" "}
            <span className="font-mono text-sm text-fog-faint">
              {earnedBadges.size}/{BADGES.length}
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-3">
            {BADGES.map((b) => {
              const got = earnedBadges.has(b.id);
              return (
                <div
                  key={b.id}
                  className={
                    "card flex items-center gap-3 p-4 " +
                    (got ? "" : "opacity-45")
                  }
                >
                  <div className="text-2xl">{got ? b.icon : "🔒"}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-fog">
                      {b.name}
                    </div>
                    <div className="truncate text-xs text-fog-faint">
                      {b.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="card p-4">
      <div className={`font-display text-2xl font-bold ${accent}`}>{value}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-fog-faint">
        {label}
      </div>
    </div>
  );
}

function TrackCard({
  track,
  completed,
}: {
  track: Track;
  completed: Set<string>;
}) {
  const { done, total } = trackCompletion(track, completed);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <Link
      href={`/trilha/${track.id}`}
      className="card group flex items-center gap-4 p-5 transition-all hover:border-fog-faint/40 hover:bg-ink-700/60"
    >
      <div className="text-3xl">{track.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-display font-semibold ${ACCENT_TEXT[track.accent]}`}>
            {track.title}
          </h3>
          <span className="font-mono text-xs text-fog-faint">
            {done}/{total}
          </span>
        </div>
        <p className="truncate text-sm text-fog-dim">{track.subtitle}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full rounded-full bg-fog/70"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-fog-faint transition group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
