import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GLOT_BASE = "https://run.glot.io/languages";
const GLOT_TOKEN = process.env.GLOT_TOKEN ?? "";

const FILENAME: Record<string, string> = {
  java: "Main.java",
  go: "main.go",
};

// glot.io aceita "latest" ou uma versão fixa (ex: "openjdk-17.0.2").
// Para listar versões fixas disponíveis: GET https://run.glot.io/languages/{lang}/versions
const VERSION: Record<string, string> = {
  java: "latest",
  go: "latest",
};

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
  if (!GLOT_TOKEN) {
    return NextResponse.json(
      {
        stdout: "",
        stderr: "",
        passed: false,
        error: "GLOT_TOKEN não configurado no servidor.",
      },
      { status: 200 },
    );
  }

  try {
    const version = VERSION[lang] ?? "latest";
    const glotRes = await fetch(`${GLOT_BASE}/${lang}/${version}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${GLOT_TOKEN}`,
      },
      body: JSON.stringify({
        files: [{ name: FILENAME[lang], content: source }],
        stdin,
      }),
    });

    if (!glotRes.ok) {
      const text = await glotRes.text();
      return NextResponse.json(
        {
          stdout: "",
          stderr: "",
          passed: false,
          error:
            glotRes.status === 429
              ? "Muitas execuções em pouco tempo. Aguarde alguns segundos e tente de novo."
              : `Serviço de execução indisponível (${glotRes.status}). ${text.slice(0, 200)}`,
        },
        { status: 200 },
      );
    }

    const data = (await glotRes.json()) as {
      stdout?: string;
      stderr?: string;
      error?: string;
    };

    // glot.io não separa "compile" de "run" nem devolve exit code.
    // "error" só vem preenchido quando o compilador/interpretador falhou.
    const compileFailed = !!data.error;
    const stdout = data.stdout ?? "";
    const stderr = [data.error ?? "", data.stderr ?? ""]
      .filter(Boolean)
      .join("\n")
      .trim();

    const passed =
      !compileFailed &&
      expected.length > 0 &&
      normalize(stdout) === normalize(expected);

    return NextResponse.json({ stdout, stderr, passed }, { status: 200 });
  } catch (err) {
    console.error("Erro ao contatar glot.io:", err);
    // DEBUG TEMPORÁRIO: inclui a mensagem de erro real na resposta.
    // Remover o campo "debug" depois de identificar a causa.
    const message = err instanceof Error ? err.message : String(err);
    const cause =
      err instanceof Error && err.cause ? String(err.cause) : undefined;
    return NextResponse.json(
      {
        stdout: "",
        stderr: "",
        passed: false,
        error: "Falha ao contatar o serviço de execução.",
        debug: { message, cause },
      },
      { status: 200 },
    );
  }
}
