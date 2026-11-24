// landing.html is the page; the Worker serves it from landing.ts, which this writes.
//   npm run build:landing   (after every change to landing.html)
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync(new URL("./landing.html", import.meta.url), "utf8");
const body = html.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
writeFileSync(
  new URL("./landing.ts", import.meta.url),
  "// Written by build-landing.mjs from landing.html: edit that file, not this one.\n" +
    "export function getLandingHtml(): string {\n  return `" + body + "`;\n}\n"
);
console.log("src/ui/landing.ts written");
