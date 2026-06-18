"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function sendLink() {
    setError(null);
    if (!email.includes("@")) {
      setError("Digite um e-mail válido.");
      return;
    }
    if (!configured) {
      setError(
        "Supabase ainda não está configurado. Adicione as variáveis de ambiente (veja o README).",
      );
      return;
    }
    setLoading(true);
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / pitch */}
      <section className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(600px 300px at 30% 20%, rgba(248,152,32,0.15), transparent 60%), radial-gradient(500px 300px at 80% 80%, rgba(0,173,216,0.15), transparent 60%)",
          }}
        />
        <div className="relative">
          <span className="font-display text-2xl font-bold tracking-tight">
            <span className="text-java">Dev</span>
            <span className="text-go">Quest</span>
          </span>
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight text-fog">
            Suba a escada do{" "}
            <span className="text-java">Java</span> ao{" "}
            <span className="text-go">Go</span> — um degrau por dia.
          </h1>
          <p className="mt-4 text-fog-dim">
            Teoria, exemplos e práticas corrigidas na hora. Ganhe XP, mantenha
            sua ofensiva e desbloqueie do básico ao System Design.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip">☕ 17 degraus de Java</span>
            <span className="chip">🐹 Golang</span>
            <span className="chip">🗣️ Inglês</span>
            <span className="chip">🛠️ Backend</span>
            <span className="chip">🤖 IA no dev</span>
          </div>
        </div>
        <div className="relative font-mono text-xs text-fog-faint">
          $ git commit -m &quot;rumo ao topo&quot;
        </div>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-2xl font-bold tracking-tight">
              <span className="text-java">Dev</span>
              <span className="text-go">Quest</span>
            </span>
          </div>

          {sent ? (
            <div className="card animate-fade-up p-7 text-center">
              <div className="text-4xl">📬</div>
              <h2 className="mt-3 font-display text-xl font-semibold text-fog">
                Verifique seu e-mail
              </h2>
              <p className="mt-2 text-sm text-fog-dim">
                Enviamos um link mágico para{" "}
                <span className="text-fog">{email}</span>. Clique nele para
                entrar — sem senha.
              </p>
              <button
                className="btn-ghost mt-5"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Usar outro e-mail
              </button>
            </div>
          ) : (
            <div className="animate-fade-up">
              <h2 className="font-display text-2xl font-bold text-fog">
                Entrar
              </h2>
              <p className="mt-1 text-sm text-fog-dim">
                Receba um link mágico no seu e-mail. Sem senha para esquecer.
              </p>

              <div className="mt-6 space-y-3">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendLink();
                  }}
                />
                <button
                  type="button"
                  onClick={sendLink}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Enviando…" : "Enviar link mágico"}
                </button>
              </div>

              {error && (
                <p className="mt-3 rounded-lg border border-ember/50 bg-ember/10 px-3 py-2 text-sm text-fog">
                  {error}
                </p>
              )}

              {!configured && (
                <p className="mt-4 text-xs text-fog-faint">
                  Modo de pré-visualização: configure o Supabase para ativar o
                  login (instruções no README).
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
