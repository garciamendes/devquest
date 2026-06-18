"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/content/types";

export function Quiz({
  questions,
  onResult,
}: {
  questions: QuizQuestion[];
  onResult?: (allCorrect: boolean) => void;
}) {
  const [picked, setPicked] = useState<(number | null)[]>(
    questions.map(() => null),
  );

  function choose(qi: number, oi: number) {
    if (picked[qi] !== null) return; // lock after answering
    const next = [...picked];
    next[qi] = oi;
    setPicked(next);

    const answered = next.every((p) => p !== null);
    if (answered && onResult) {
      const allCorrect = next.every((p, idx) => p === questions[idx].answer);
      onResult(allCorrect);
    }
  }

  const correctCount = picked.filter(
    (p, idx) => p === questions[idx].answer,
  ).length;
  const allAnswered = picked.every((p) => p !== null);

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const chosen = picked[qi];
        return (
          <div key={qi} className="card p-5">
            <p className="mb-4 font-medium text-fog">
              <span className="mr-2 font-mono text-sm text-fog-faint">
                {String(qi + 1).padStart(2, "0")}
              </span>
              {q.q}
            </p>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isCorrect = oi === q.answer;
                const answered = chosen !== null;

                let cls =
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ";
                if (!answered) {
                  cls +=
                    "border-line bg-ink-700/40 text-fog-dim hover:border-java/50 hover:bg-ink-700";
                } else if (isCorrect) {
                  cls += "border-leaf/60 bg-leaf/10 text-fog";
                } else if (isChosen) {
                  cls += "border-ember/60 bg-ember/10 text-fog";
                } else {
                  cls += "border-line bg-ink-800/40 text-fog-faint";
                }

                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => choose(qi, oi)}
                    disabled={answered}
                    className={cls}
                  >
                    <span className="font-mono text-xs text-fog-faint">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {answered && isCorrect && <span>✓</span>}
                    {answered && isChosen && !isCorrect && <span>✕</span>}
                  </button>
                );
              })}
            </div>
            {chosen !== null && q.explain && (
              <p className="mt-3 rounded-lg bg-ink-900/60 px-3 py-2 text-sm text-fog-dim">
                {q.explain}
              </p>
            )}
          </div>
        );
      })}

      {allAnswered && (
        <p className="text-sm text-fog-dim">
          Você acertou{" "}
          <span className="font-semibold text-fog">
            {correctCount}/{questions.length}
          </span>
          .{" "}
          {correctCount === questions.length
            ? "Mandou bem! 🎯"
            : "Revise a teoria e tente entender os erros."}
        </p>
      )}
    </div>
  );
}
