"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/content/types";
import { Markdown } from "./Markdown";

type RunResult = {
  stdout: string;
  stderr: string;
  passed: boolean;
  error?: string;
};

export function CodeRunner({
  exercise,
  onPass,
}: {
  exercise: Exercise;
  onPass?: () => void;
}) {
  const [code, setCode] = useState(exercise.starter);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [passedOnce, setPassedOnce] = useState(true);

  // async function run() {
  //   setRunning(true);
  //   setResult(null);
  //   try {
  //     const res = await fetch("/api/run", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         lang: exercise.lang,
  //         source: code,
  //         stdin: exercise.stdin ?? "",
  //         expected: exercise.expectedOutput,
  //       }),
  //     });
  //     const data = (await res.json()) as RunResult;
  //     setResult(data);
  //     if (data.passed && !passedOnce) {
  //       setPassedOnce(true);
  //       onPass?.();
  //     }
  //   } catch {
  //     setResult({
  //       stdout: "",
  //       stderr: "",
  //       passed: false,
  //       error: "Não foi possível executar agora. Verifique a conexão e tente de novo.",
  //     });
  //   } finally {
  //     setRunning(false);
  //   }
  // }

  const accent = exercise.lang === "go" ? "go" : "java";

  return (
    <div className="space-y-4">
      <div className="prose-none">
        <Markdown source={exercise.prompt} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-ink-900">
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="font-mono text-xs uppercase tracking-wider text-fog-faint">
            {exercise.lang === "go" ? "main.go" : "Main.java"}
          </span>
          <span
            className={"chip " + (accent === "go" ? "text-go" : "text-java")}
          >
            {exercise.lang === "go" ? "🐹 Go" : "☕ Java"}
          </span>
        </div>
        <textarea
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={Math.min(20, Math.max(8, code.split("\n").length + 1))}
          className="w-full resize-y bg-ink-900 p-4 font-mono text-sm text-fog outline-none"
          aria-label="Editor de código"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {}}
          disabled={running}
          className={accent === "go" ? "btn-go" : "btn-primary"}
        >
          {running ? "Executando…" : "▶ Executar"}
        </button>
        {exercise.hint && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowHint((v) => !v)}
          >
            💡 Dica
          </button>
        )}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setShowSolution((v) => !v)}
        >
          {showSolution ? "Ocultar solução" : "Ver solução"}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setCode(exercise.starter)}
        >
          ↺ Resetar
        </button>
      </div>

      {showHint && exercise.hint && (
        <p className="rounded-lg border border-line bg-ink-700/40 px-4 py-3 text-sm text-fog-dim">
          {exercise.hint}
        </p>
      )}

      {result && (
        <div
          className={
            "rounded-xl border p-4 animate-fade-up " +
            (result.passed
              ? "border-leaf/50 bg-leaf/10"
              : "border-ember/50 bg-ember/10")
          }
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            {result.passed ? (
              <span className="text-leaf">✓ Passou! Saída correta.</span>
            ) : (
              <span className="text-ember">✕ Ainda não — compare a saída.</span>
            )}
          </div>
          {result.error && (
            <p className="text-sm text-fog-dim">{result.error}</p>
          )}
          {result.stdout && (
            <div className="mt-2">
              <div className="mb-1 text-xs uppercase tracking-wider text-fog-faint">
                Saída
              </div>
              <pre className="overflow-x-auto rounded-lg bg-ink-900 p-3 font-mono text-sm text-fog whitespace-pre-wrap">
                {result.stdout}
              </pre>
            </div>
          )}
          {result.stderr && (
            <div className="mt-2">
              <div className="mb-1 text-xs uppercase tracking-wider text-fog-faint">
                Erros / compilação
              </div>
              <pre className="overflow-x-auto rounded-lg bg-ink-900 p-3 font-mono text-sm text-ember whitespace-pre-wrap">
                {result.stderr}
              </pre>
            </div>
          )}
        </div>
      )}

      {showSolution && (
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="border-b border-line bg-ink-800 px-4 py-2 text-xs uppercase tracking-wider text-fog-faint">
            Solução de referência
          </div>
          <pre className="overflow-x-auto bg-ink-900 p-4 font-mono text-sm text-fog whitespace-pre">
            {exercise.solution}
          </pre>
        </div>
      )}
    </div>
  );
}
