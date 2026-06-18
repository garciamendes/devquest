import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PISTON = process.env.PISTON_URL ?? "https://emkc.org/api/v2/piston";

const FILENAME: Record<string, string> = {
  java: "Main.java",
  go: "main.go",
};

// Fallback versions if the runtimes endpoint is unreachable.
const FALLBACK_VERSION: Record<string, string> = {
  java: "15.0.2",
  go: "1.16.2",
};

// Cache resolved versions for the lifetime of the warm serverless instance.
let versionCache: Record<string, string> | null = null;

async function resolveVersion(lang: string): Promise<string> {
  if (versionCache?.[lang]) return versionCache[lang];
  try {
    const res = await fetch(`${PISTON}/runtimes`, {
      // runtimes change rarely; let the platform cache for an hour
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const runtimes = (await res.json()) as Array<{
        language: string;
        version: string;
        aliases?: string[];
      }>;
      const map: Record<string, string> = {};
      for (const r of runtimes) {
        const key = r.language;
        // keep the highest version we see for each language
        if (!map[key] || compareVersions(r.version, map[key]) > 0) {
          map[key] = r.version;
        }
      }
      versionCache = { ...FALLBACK_VERSION, ...map };
      if (versionCache[lang]) return versionCache[lang];
    }
  } catch {
    // fall through to fallback
  }
  return FALLBACK_VERSION[lang];
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** Normalize output for forgiving comparison. */
function normalize(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
}

export async function POST(request: Request) {
  let body: {
    lang?: string;
    source?: string;
    stdin?: string;
    expected?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const lang = body.lang ?? "";
  const source = body.source ?? "";
  const stdin = body.stdin ?? "";
  const expected = body.expected ?? "";

  if (!FILENAME[lang]) {
    return NextResponse.json(
      { error: "Linguagem não suportada" },
      { status: 400 },
    );
  }
  if (typeof source !== "string" || source.length === 0) {
    return NextResponse.json({ error: "Código vazio" }, { status: 400 });
  }
  if (source.length > 50_000) {
    return NextResponse.json({ error: "Código muito longo" }, { status: 413 });
  }

  try {
    const version = await resolveVersion(lang);
    const pistonRes = await fetch(`${PISTON}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        version,
        files: [{ name: FILENAME[lang], content: source }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 6000,
      }),
    });

    if (!pistonRes.ok) {
      const text = await pistonRes.text();
      return NextResponse.json(
        {
          stdout: "",
          stderr: "",
          passed: false,
          error:
            pistonRes.status === 429
              ? "Muitas execuções em pouco tempo. Aguarde alguns segundos e tente de novo."
              : `Serviço de execução indisponível (${pistonRes.status}). ${text.slice(0, 200)}`,
        },
        { status: 200 },
      );
    }

    const data = (await pistonRes.json()) as {
      compile?: { stdout?: string; stderr?: string; code?: number };
      run?: { stdout?: string; stderr?: string; code?: number };
    };

    const compileErr = data.compile?.stderr ?? "";
    const compileFailed = (data.compile?.code ?? 0) !== 0 && !!compileErr;
    const stdout = data.run?.stdout ?? "";
    const runErr = data.run?.stderr ?? "";
    const stderr = [compileErr, runErr].filter(Boolean).join("\n").trim();

    const passed =
      !compileFailed &&
      (data.run?.code ?? 1) === 0 &&
      expected.length > 0 &&
      normalize(stdout) === normalize(expected);

    return NextResponse.json({ stdout, stderr, passed }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        stdout: "",
        stderr: "",
        passed: false,
        error: "Falha ao contatar o serviço de execução.",
      },
      { status: 200 },
    );
  }
}
