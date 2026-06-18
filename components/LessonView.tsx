"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson, Accent } from "@/lib/content/types";
import {
  completeLesson,
  type ProgressState,
  type BadgeDef,
} from "@/lib/gamification";
import { saveProgress } from "@/app/actions/progress";
import { Markdown } from "./Markdown";
import { Quiz } from "./Quiz";
import { CodeRunner } from "./CodeRunner";

const LANG_LABEL: Record<string, string> = {
  java: "Java",
  go: "Go",
  sql: "SQL",
  yaml: "YAML",
  bash: "Bash",
  text: "",
};

function ExampleBlock({
  title,
  code,
  lang,
  note,
}: {
  title: string;
  code: string;
  lang: string;
  note?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center justify-between border-b border-line bg-ink-800 px-4 py-2">
        <span className="text-sm font-medium text-fog">{title}</span>
        {LANG_LABEL[lang] && (
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-fog-faint">
            {LANG_LABEL[lang]}
          </span>
        )}
      </div>
      <pre className="overflow-x-auto bg-ink-900 p-4 font-mono text-sm text-fog whitespace-pre">
        {code}
      </pre>
      {note && (
        <div className="border-t border-line bg-ink-800/60 px-4 py-2 text-sm text-fog-dim">
          {note}
        </div>
      )}
    </div>
  );
}

export function LessonView({
  lesson,
  accent,
  trackTitle,
  initialState,
  nextHref,
  backHref,
}: {
  lesson: Lesson;
  accent: Accent;
  trackTitle: string;
  initialState: ProgressState;
  nextHref: string | null;
  backHref: string;
}) {
  const already = initialState.completedLessons.includes(lesson.id);
  const [done, setDone] = useState(already);
  const [saving, setSaving] = useState(false);
  const [quizPassed, setQuizPassed] = useState(!lesson.quiz);
  const [exercisePassed, setExercisePassed] = useState(!lesson.exercise);
  const [celebration, setCelebration] = useState<{
    xp: number;
    leveledUp: boolean;
    badges: BadgeDef[];
  } | null>(null);

  const canComplete = quizPassed && exercisePassed;
  const accentBtn = accent === "go" ? "btn-go" : "btn-primary";

  async function handleComplete() {
    if (saving || done) return;
    setSaving(true);
    const result = completeLesson(initialState, lesson.id, lesson.xp);
    const res = await saveProgress(result.state);
    setSaving(false);
    if (!res.ok) {
      setCelebration({ xp: 0, leveledUp: false, badges: [] });
      setDone(true);
      return;
    }
    setDone(true);
    setCelebration({
      xp: result.gainedXp,
      leveledUp: result.leveledUp,
      badges: result.newBadges,
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-fog-dim hover:text-fog"
      >
        ← {trackTitle}
      </Link>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="chip">⏱ {lesson.minutes} min</span>
          <span
            className={
              "chip " + (accent === "go" ? "text-go" : "text-java")
            }
          >
            +{lesson.xp} XP
          </span>
          {done && (
            <span className="chip border-leaf/50 bg-leaf/10 text-leaf">
              ✓ Concluída
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-fog">
          {lesson.title}
        </h1>
      </header>

      <article className="animate-fade-up">
        <Markdown source={lesson.theory} />
      </article>

      {lesson.examples && lesson.examples.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="font-display text-lg font-semibold text-fog">
            Exemplos
          </h2>
          {lesson.examples.map((ex, i) => (
            <ExampleBlock key={i} {...ex} />
          ))}
        </section>
      )}

      {lesson.quiz && lesson.quiz.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-fog">
            Quiz
          </h2>
          <Quiz
            questions={lesson.quiz}
            onResult={(allCorrect) => {
              // Answering unlocks completion; full marks are encouraged but
              // not required so learners aren't hard-blocked.
              setQuizPassed(true);
              void allCorrect;
            }}
          />
        </section>
      )}

      {lesson.exercise && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-fog">
            Prática (correção automática)
          </h2>
          <CodeRunner
            exercise={lesson.exercise}
            onPass={() => setExercisePassed(true)}
          />
        </section>
      )}

      <section className="mt-12 border-t border-line pt-8">
        {celebration ? (
          <div className="card animate-pop p-6 text-center">
            <div className="text-4xl">🎉</div>
            <h3 className="mt-2 font-display text-xl font-semibold text-fog">
              Lição concluída!
            </h3>
            {celebration.xp > 0 && (
              <p className="mt-1 text-fog-dim">
                +{celebration.xp} XP conquistados
              </p>
            )}
            {celebration.leveledUp && (
              <p className="mt-1 font-semibold text-java">⬆ Subiu de nível!</p>
            )}
            {celebration.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {celebration.badges.map((b) => (
                  <span key={b.id} className="chip text-fog">
                    {b.icon} {b.name}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {nextHref ? (
                <Link href={nextHref} className={accentBtn}>
                  Próxima lição →
                </Link>
              ) : (
                <Link href="/dashboard" className={accentBtn}>
                  Voltar ao painel
                </Link>
              )}
              <Link href={backHref} className="btn-ghost">
                Ver a trilha
              </Link>
            </div>
          </div>
        ) : done ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-fog-dim">
              Você já concluiu esta lição. ✓
            </span>
            <div className="flex gap-3">
              {nextHref && (
                <Link href={nextHref} className={accentBtn}>
                  Próxima lição →
                </Link>
              )}
              <Link href={backHref} className="btn-ghost">
                Ver a trilha
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3">
            {!canComplete && (
              <p className="text-sm text-fog-faint">
                {lesson.exercise && !exercisePassed
                  ? "Faça o exercício passar para concluir."
                  : "Responda o quiz para concluir."}
              </p>
            )}
            <button
              type="button"
              onClick={handleComplete}
              disabled={!canComplete || saving}
              className={accentBtn}
            >
              {saving ? "Salvando…" : `Concluir lição (+${lesson.xp} XP)`}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
