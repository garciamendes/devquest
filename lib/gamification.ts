// Pure, deterministic gamification logic. No side effects.

export type ProgressState = {
  completedLessons: string[]; // lesson ids the user has finished
  xp: number;
  streak: number; // current consecutive-day streak
  bestStreak: number;
  lastActive: string | null; // YYYY-MM-DD (UTC)
  badges: string[]; // badge ids earned
};

export const emptyState: ProgressState = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActive: null,
  badges: [],
};

/** Merge a possibly-partial stored blob into a valid state. */
export function normalize(raw: unknown): ProgressState {
  const s = (raw ?? {}) as Partial<ProgressState>;
  return {
    completedLessons: Array.isArray(s.completedLessons)
      ? Array.from(new Set(s.completedLessons.filter((x) => typeof x === "string")))
      : [],
    xp: typeof s.xp === "number" && s.xp >= 0 ? Math.floor(s.xp) : 0,
    streak: typeof s.streak === "number" && s.streak >= 0 ? Math.floor(s.streak) : 0,
    bestStreak: typeof s.bestStreak === "number" && s.bestStreak >= 0 ? Math.floor(s.bestStreak) : 0,
    lastActive: typeof s.lastActive === "string" ? s.lastActive : null,
    badges: Array.isArray(s.badges) ? s.badges.filter((x) => typeof x === "string") : [],
  };
}

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = Date.parse(a + "T00:00:00Z");
  const db = Date.parse(b + "T00:00:00Z");
  return Math.round((db - da) / 86_400_000);
}

// --- Levels ---------------------------------------------------------------
// XP needed to *reach* a given level. Smooth quadratic curve.
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(80 * Math.pow(level - 1, 1.6));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - floor;
  const span = Math.max(1, next - floor);
  return {
    level,
    into,
    span,
    next,
    pct: Math.min(100, Math.round((into / span) * 100)),
    toNext: Math.max(0, next - xp),
  };
}

export function rankTitle(level: number): string {
  if (level >= 30) return "Arquiteto";
  if (level >= 22) return "Staff Engineer";
  if (level >= 16) return "Sênior";
  if (level >= 10) return "Pleno";
  if (level >= 5) return "Júnior";
  return "Iniciante";
}

// --- Badges ---------------------------------------------------------------
export type BadgeDef = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  check: (s: ProgressState) => boolean;
};

export const BADGES: BadgeDef[] = [
  { id: "first-step", name: "Primeiro Passo", desc: "Concluiu a primeira lição", icon: "🥾", check: (s) => s.completedLessons.length >= 1 },
  { id: "ten-lessons", name: "Pegando o Ritmo", desc: "10 lições concluídas", icon: "⚡", check: (s) => s.completedLessons.length >= 10 },
  { id: "fifty-lessons", name: "Maratonista", desc: "50 lições concluídas", icon: "🏃", check: (s) => s.completedLessons.length >= 50 },
  { id: "streak-3", name: "Constância", desc: "Ofensiva de 3 dias", icon: "🔥", check: (s) => s.bestStreak >= 3 },
  { id: "streak-7", name: "Semana Cheia", desc: "Ofensiva de 7 dias", icon: "📅", check: (s) => s.bestStreak >= 7 },
  { id: "streak-30", name: "Inabalável", desc: "Ofensiva de 30 dias", icon: "💎", check: (s) => s.bestStreak >= 30 },
  { id: "xp-1000", name: "Mil de XP", desc: "Alcançou 1000 XP", icon: "✨", check: (s) => s.xp >= 1000 },
  { id: "xp-5000", name: "Veterano", desc: "Alcançou 5000 XP", icon: "🏆", check: (s) => s.xp >= 5000 },
  { id: "level-10", name: "Dev Pleno", desc: "Chegou ao nível 10", icon: "🚀", check: (s) => levelFromXp(s.xp) >= 10 },
];

function recomputeBadges(s: ProgressState): ProgressState {
  const earned = new Set(s.badges);
  for (const b of BADGES) if (b.check(s)) earned.add(b.id);
  return { ...s, badges: Array.from(earned) };
}

// --- Mutations ------------------------------------------------------------

/** Update the daily streak for an activity happening today (UTC). */
export function touchStreak(s: ProgressState): ProgressState {
  const today = todayUTC();
  if (s.lastActive === today) return s; // already counted today
  let streak = 1;
  if (s.lastActive) {
    const diff = daysBetween(s.lastActive, today);
    if (diff === 1) streak = s.streak + 1;
    else if (diff <= 0) streak = Math.max(1, s.streak);
  }
  const next = { ...s, streak, bestStreak: Math.max(s.bestStreak, streak), lastActive: today };
  return recomputeBadges(next);
}

export type CompletionResult = {
  state: ProgressState;
  gainedXp: number;
  alreadyDone: boolean;
  leveledUp: boolean;
  newBadges: BadgeDef[];
};

/** Mark a lesson complete; awards XP only the first time. */
export function completeLesson(
  s: ProgressState,
  lessonId: string,
  xp: number,
): CompletionResult {
  const before = normalize(s);
  const prevLevel = levelFromXp(before.xp);
  const prevBadges = new Set(before.badges);

  if (before.completedLessons.includes(lessonId)) {
    const withStreak = touchStreak(before);
    return {
      state: withStreak,
      gainedXp: 0,
      alreadyDone: true,
      leveledUp: false,
      newBadges: withStreak.badges
        .filter((b) => !prevBadges.has(b))
        .map((id) => BADGES.find((x) => x.id === id)!)
        .filter(Boolean),
    };
  }

  let next: ProgressState = {
    ...before,
    completedLessons: [...before.completedLessons, lessonId],
    xp: before.xp + xp,
  };
  next = touchStreak(next);
  next = recomputeBadges(next);

  return {
    state: next,
    gainedXp: xp,
    alreadyDone: false,
    leveledUp: levelFromXp(next.xp) > prevLevel,
    newBadges: next.badges
      .filter((b) => !prevBadges.has(b))
      .map((id) => BADGES.find((x) => x.id === id)!)
      .filter(Boolean),
  };
}
