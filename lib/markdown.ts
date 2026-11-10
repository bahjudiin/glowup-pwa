/**
 * A tiny, dependency-free Markdown -> HTML renderer.
 *
 * Security model
 * --------------
 * The source text is escaped FIRST (`&`, `<`, `>`, `"`, `'`), so by the time any
 * markup is produced the only `<` characters in the string are the ones this
 * module itself writes. Source content can therefore never inject markup,
 * attributes or script tags.
 *
 * Supported syntax
 * ----------------
 *   `# h1`            `## h2`            `### h3`
 *   `- item`          `1. item`          `> quote`
 *   `**bold**`        `*italic*`         `` `code` ``
 *   `---`             blank-line separated paragraphs
 *
 * Everything else is rendered as escaped text inside a paragraph.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape every HTML-significant character in a raw string. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

const INLINE_PATTERN = /`([^`\n]+)`|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;

/**
 * Apply inline formatting to already-escaped text.
 * Safe because the text contains no unescaped `<` or `>`.
 */
export function renderInline(escaped: string): string {
  return escaped.replace(
    INLINE_PATTERN,
    (_match, code: string | undefined, bold: string | undefined, italic: string | undefined) => {
      if (code !== undefined) return `<code>${code}</code>`;
      if (bold !== undefined) return `<strong>${bold}</strong>`;
      return `<em>${italic}</em>`;
    }
  );
}

function isBlank(line: string): boolean {
  return line.trim().length === 0;
}

function isHeading(line: string): boolean {
  return /^#{1,3}\s+\S/.test(line);
}

function isThematicBreak(line: string): boolean {
  return /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line);
}

function isUnorderedItem(line: string): boolean {
  return /^\s*[-*+]\s+\S/.test(line);
}

function isOrderedItem(line: string): boolean {
  return /^\s*\d+[.)]\s+\S/.test(line);
}

function isQuote(line: string): boolean {
  return /^\s*>\s?/.test(line);
}

function isListContinuation(line: string): boolean {
  return /^\s{2,}\S/.test(line) && !isListItemStart(line);
}

function isListItemStart(line: string): boolean {
  return isUnorderedItem(line) || isOrderedItem(line);
}

/**
 * Render a Markdown document to sanitized HTML.
 */
export function renderMarkdown(source: string | undefined | null): string {
  if (!source || !source.trim()) return "";

  const lines = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const out: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      i += 1;
      continue;
    }

    // --- horizontal rule -------------------------------------------------
    if (isThematicBreak(line)) {
      out.push("<hr />");
      i += 1;
      continue;
    }

    // --- headings --------------------------------------------------------
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = renderInline(escapeHtml(heading[2].trim()));
      out.push(`<h${level}>${text}</h${level}>`);
      i += 1;
      continue;
    }

    // --- unordered list --------------------------------------------------
    if (isUnorderedItem(line)) {
      const items: string[] = [];
      while (i < lines.length && isUnorderedItem(lines[i])) {
        let content = lines[i].replace(/^\s*[-*+]\s+/, "");
        i += 1;
        while (i < lines.length && isListContinuation(lines[i])) {
          content += ` ${lines[i].trim()}`;
          i += 1;
        }
        items.push(`<li>${renderInline(escapeHtml(content.trim()))}</li>`);
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // --- ordered list ----------------------------------------------------
    if (isOrderedItem(line)) {
      const items: string[] = [];
      while (i < lines.length && isOrderedItem(lines[i])) {
        let content = lines[i].replace(/^\s*\d+[.)]\s+/, "");
        i += 1;
        while (i < lines.length && isListContinuation(lines[i])) {
          content += ` ${lines[i].trim()}`;
          i += 1;
        }
        items.push(`<li>${renderInline(escapeHtml(content.trim()))}</li>`);
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // --- blockquote ------------------------------------------------------
    if (isQuote(line)) {
      const parts: string[] = [];
      while (i < lines.length && isQuote(lines[i])) {
        parts.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      const text = renderInline(escapeHtml(parts.join(" ").trim()));
      out.push(`<blockquote><p>${text}</p></blockquote>`);
      continue;
    }

    // --- paragraph -------------------------------------------------------
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      !isBlank(lines[i]) &&
      !isHeading(lines[i]) &&
      !isThematicBreak(lines[i]) &&
      !isListItemStart(lines[i]) &&
      !isQuote(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    if (paragraph.length) {
      const text = renderInline(escapeHtml(paragraph.join(" ")));
      out.push(`<p>${text}</p>`);
    }
  }

  return out.join("\n");
}

/**
 * Strip Markdown down to plain text — used for search indexing and for
 * meta descriptions so no markup ever leaks into a `description` attribute.
 */
export function markdownToPlainText(source: string | undefined | null): string {
  if (!source) return "";
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*(-{3,}|\*{3,}|_{3,})\s*$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}
