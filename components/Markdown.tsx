import React from "react";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Inline formatting: `code` and **bold**. Input is escaped first. */
function inline(raw: string): string {
  let s = escapeHtml(raw);
  s = s.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[0.85em] text-java">$1</code>',
  );
  s = s.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-semibold text-fog">$1</strong>',
  );
  return s;
}

/**
 * Renders a small markdown subset: ## / ### headings, - lists,
 * ```fenced code```, > blockquotes, **bold**, `inline code`, paragraphs.
 * Content is author-controlled and fully escaped, so the resulting HTML
 * only ever contains tags we generate here.
 */
export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      const fence = line.trimStart();
      const lang = fence.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        body.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      const langLabel = lang
        ? `<div class="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-fog-faint">${escapeHtml(
            lang,
          )}</div>`
        : "";
      html.push(
        `<pre class="my-4 overflow-x-auto rounded-xl border border-line bg-ink-900 p-4 text-sm">${langLabel}<code class="font-mono text-fog whitespace-pre">${escapeHtml(
          body.join("\n"),
        )}</code></pre>`,
      );
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      html.push(
        `<h3 class="mt-5 mb-2 font-display text-lg font-semibold text-fog">${inline(
          line.slice(4),
        )}</h3>`,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      html.push(
        `<h2 class="mt-7 mb-3 font-display text-xl font-semibold text-fog">${inline(
          line.slice(3),
        )}</h2>`,
      );
      i++;
      continue;
    }

    // Blockquote (possibly multi-line)
    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2));
        i++;
      }
      html.push(
        `<blockquote class="my-4 rounded-r-lg border-l-2 border-java/60 bg-ink-700/40 px-4 py-2 italic text-fog-dim">${inline(
          quote.join(" "),
        )}</blockquote>`,
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${inline(lines[i].slice(2))}</li>`);
        i++;
      }
      html.push(
        `<ul class="my-3 list-disc space-y-1.5 pl-5 text-fog-dim">${items.join(
          "",
        )}</ul>`,
      );
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph: gather consecutive plain lines
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("> ") &&
      !lines[i].trimStart().startsWith("```")
    ) {
      para.push(lines[i]);
      i++;
    }
    html.push(
      `<p class="my-3 leading-relaxed text-fog-dim">${inline(
        para.join(" "),
      )}</p>`,
    );
  }

  return (
    <div
      className="text-[0.95rem]"
      dangerouslySetInnerHTML={{ __html: html.join("") }}
    />
  );
}
