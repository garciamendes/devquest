"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  levelProgress,
  rankTitle,
  type ProgressState,
} from "@/lib/gamification";

export function TopBar({
  email,
  state,
}: {
  email: string | null;
  state: ProgressState;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const lp = levelProgress(state.xp);

  async function signOut() {
    setBusy(true);
    try {
      await createClient().auth.signOut();
    } catch {
      // ignore; redirect regardless
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-java">Dev</span>
            <span className="text-go">Quest</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <span className="chip" title="Ofensiva diária">
            <span className={state.streak > 0 ? "animate-flame" : ""}>🔥</span>
            {state.streak}d
          </span>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right">
              <div className="font-mono text-xs text-fog-dim">
                Nível {lp.level} · {rankTitle(lp.level)}
              </div>
              <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-ink-700">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${lp.pct}%`,
                    background:
                      "linear-gradient(90deg, #F89820, #00ADD8)",
                  }}
                />
              </div>
            </div>
            <span className="font-mono text-xs text-fog-faint">
              {state.xp} XP
            </span>
          </div>

          <button
            type="button"
            onClick={signOut}
            disabled={busy}
            className="btn-ghost px-3 py-2 text-xs"
            title={email ?? undefined}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
