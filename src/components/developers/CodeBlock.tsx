type Token = {
  text: string;
  className?: string;
};

function highlight(source: string, pattern: RegExp, classNameFor: (value: string) => string | undefined) {
  const tokens: Token[] = [];
  let last = 0;

  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: source.slice(last, index) });
    const value = match[0];
    tokens.push({ text: value, className: classNameFor(value) });
    last = index + value.length;
  }

  if (last < source.length) tokens.push({ text: source.slice(last) });
  return tokens;
}

function highlightJson(source: string) {
  return highlight(
    source,
    /"(?:\\.|[^"\\])*"\s*:|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}\[\],]/g,
    (value) => {
      if (value.startsWith('"')) return /:\s*$/.test(value) ? "text-sky-300" : "text-emerald-300";
      if (value === "true" || value === "false") return "text-violet-300";
      if (value === "null") return "text-rose-300";
      if (value === "{" || value === "}" || value === "[" || value === "]") return "text-slate-300";
      if (value === ",") return "text-slate-500";
      return "text-amber-300";
    },
  );
}

function highlightCurl(source: string) {
  return highlight(source, /\bcurl\b|-[A-Za-z]+|"(?:\\.|[^"\\])*"|\\/g, (value) => {
    if (value === "curl") return "font-semibold text-pink-300";
    if (value.startsWith("-")) return "text-cyan-300";
    if (value === "\\") return "text-slate-500";
    if (value.includes("http")) return "text-amber-200";
    return "text-emerald-300";
  });
}

export default function CodeBlock({ code, language }: { code: string; language: "json" | "curl" }) {
  const tokens = language === "json" ? highlightJson(code) : highlightCurl(code);

  return (
    <code>
      {tokens.map((token, index) =>
        token.className ? (
          <span key={index} className={token.className}>
            {token.text}
          </span>
        ) : (
          token.text
        ),
      )}
    </code>
  );
}
