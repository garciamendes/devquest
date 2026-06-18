import Link from "next/link";
import type { Track } from "@/lib/content/types";
import { isModuleUnlocked, moduleCompletion } from "@/lib/content";

export function Staircase({
  track,
  completed,
}: {
  track: Track;
  completed: Set<string>;
}) {
  // Determine the "current" step: first unlocked module not fully complete.
  let currentId: string | null = null;
  for (const m of track.modules) {
    const { done, total } = moduleCompletion(m, completed);
    if (isModuleUnlocked(m, completed) && done < total) {
      currentId = m.id;
      break;
    }
  }

  return (
    <div className="relative">
      <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fog-faint">
        <span>Nível do solo</span>
        <span className="h-px flex-1 bg-line" />
        <span className="text-java">topo · system design</span>
      </div>

      <ol className="flex flex-col-reverse gap-2">
        {track.modules.map((m, idx) => {
          const { done, total } = moduleCompletion(m, completed);
          const unlocked = isModuleUnlocked(m, completed);
          const isDone = done === total && total > 0;
          const isCurrent = m.id === currentId;
          // Ascending indent that caps so it never overflows on mobile.
          const indent = Math.min(idx, 8) * 14;

          const base =
            "group relative flex items-center gap-4 rounded-xl border px-4 py-3 transition-all";
          let stateCls: string;
          if (isDone) {
            stateCls =
              "border-java/40 bg-java/5 shadow-glow hover:bg-java/10";
          } else if (isCurrent) {
            stateCls =
              "border-java/60 bg-ink-700/70 ring-2 ring-java/40 hover:bg-ink-600";
          } else if (unlocked) {
            stateCls = "border-line bg-ink-800/60 hover:bg-ink-700/70";
          } else {
            stateCls = "border-line/60 bg-ink-900/40 opacity-55";
          }

          const inner = (
            <div className={`${base} ${stateCls}`}>
              <span
                className={
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold " +
                  (isDone
                    ? "bg-java text-ink-900"
                    : isCurrent
                      ? "bg-java/20 text-java"
                      : unlocked
                        ? "bg-ink-700 text-fog-dim"
                        : "bg-ink-800 text-fog-faint")
                }
              >
                {String(m.step ?? idx + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{m.icon}</span>
                  <span className="truncate font-medium text-fog">
                    {m.title}
                  </span>
                </div>
                <p className="truncate text-xs text-fog-faint">{m.summary}</p>
              </div>
              <div className="shrink-0 text-right">
                {!unlocked ? (
                  <span className="text-fog-faint">🔒</span>
                ) : (
                  <span
                    className={
                      "font-mono text-xs " +
                      (isDone ? "text-java" : "text-fog-dim")
                    }
                  >
                    {done}/{total}
                  </span>
                )}
                {isCurrent && (
                  <div className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-java">
                    atual
                  </div>
                )}
              </div>
            </div>
          );

          return (
            <li key={m.id} style={{ marginLeft: indent }}>
              {unlocked ? (
                <Link href={`/trilha/${track.id}`} className="block">
                  {inner}
                </Link>
              ) : (
                <div aria-disabled className="block cursor-not-allowed">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
