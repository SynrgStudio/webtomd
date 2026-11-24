// WebToMD as a local MCP server: any page as clean Markdown, fetched from this
// computer with the same extractor as md.synrgs.tech (src/extract).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { htmlToCleanMarkdown } from "../src/extract/htmlToMarkdown";
import { closeBrowser, render } from "./browser";

declare const __VERSION__: string;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
const OUT_DIR = process.env.WEBTOMD_DIR || join(tmpdir(), "webtomd");
const CACHE_MS = Number(process.env.WEBTOMD_CACHE_S ?? 3600) * 1000;

interface Page {
  url: string;
  title: string;
  markdown: string;
  how: string; // "fetched" or "rendered in Edge"
}

const cache = new Map<string, { at: number; page: Page }>();

class FetchError extends Error {
  constructor(message: string, readonly status = 0) {
    super(message);
  }
}

async function plainFetch(url: string) {
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
      },
    });
  } catch (e: any) {
    throw new FetchError(`Could not reach ${new URL(url).host}: ${e?.cause?.code ?? e?.message ?? e}`);
  }
  return { status: res.status, ok: res.ok, type: res.headers.get("content-type") ?? "", body: await res.text(), finalUrl: res.url || url };
}

function titleOf(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return "";
  return m[1]
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/\s+/g, " ")
    .trim();
}

// Readable text left once links, images and Markdown signs are taken out.
function textLength(md: string): number {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|\-\s]+/g, " ")
    .trim().length;
}

async function getPage(url: string, mode: "auto" | "never" | "always"): Promise<Page> {
  let fetched: Page | null = null;
  let blocked: FetchError | null = null;

  if (mode !== "always") {
    const r = await plainFetch(url);
    if (!r.ok) {
      const err = new FetchError(`${new URL(url).host} answered HTTP ${r.status}`, r.status);
      // A bot wall often lets a real browser through.
      if (mode === "auto" && [401, 403, 429, 503].includes(r.status)) blocked = err;
      else throw err;
    } else if (/text\/(markdown|plain)/i.test(r.type)) {
      return { url: r.finalUrl, title: "", markdown: r.body, how: "fetched" };
    } else if (/json/i.test(r.type)) {
      return { url: r.finalUrl, title: "", markdown: "```json\n" + r.body + "\n```", how: "fetched" };
    } else if (r.type && !/html|xml/i.test(r.type)) {
      throw new FetchError(`Not a web page: ${r.type} (${r.body.length.toLocaleString("en-US")} characters)`);
    } else {
      fetched = { url: r.finalUrl, title: titleOf(r.body), markdown: htmlToCleanMarkdown(r.body, r.finalUrl), how: "fetched" };
      if (mode === "never" || textLength(fetched.markdown) >= 400) return fetched;
    }
  }

  // Next: the page needs its JavaScript, or a bot wall stopped the plain request.
  try {
    const r = await render(url);
    const page = { url: r.finalUrl, title: titleOf(r.html), markdown: htmlToCleanMarkdown(r.html, r.finalUrl), how: `rendered in ${r.browser}` };
    if (fetched && textLength(page.markdown) <= textLength(fetched.markdown)) return fetched;
    return page;
  } catch (e: any) {
    if (fetched) return { ...fetched, how: `fetched (the browser failed: ${e?.message ?? e})` };
    if (blocked) throw new FetchError(`${blocked.message}, and the browser failed too: ${e?.message ?? e}`, blocked.status);
    throw e;
  }
}

function fileFor(url: string): string {
  const u = new URL(url);
  const slug = (u.host + u.pathname).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80);
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  return join(OUT_DIR, `${slug}-${hash}.md`);
}

// Lines that contain the text, each with two lines around it; blocks close together merge.
function grep(md: string, needle: string): string {
  const lines = md.split("\n");
  const n = needle.toLowerCase();
  const keep = new Set<number>();
  lines.forEach((l, i) => {
    if (l.toLowerCase().includes(n)) for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 2); j++) keep.add(j);
  });
  if (!keep.size) return "";
  const out: string[] = [];
  let last = -2;
  for (const i of [...keep].sort((a, b) => a - b)) {
    if (i > last + 1 && out.length) out.push("…");
    out.push(`${i + 1}: ${lines[i]}`);
    last = i;
  }
  return out.join("\n");
}

const server = new McpServer({ name: "webtomd", version: __VERSION__ });

server.registerTool(
  "fetch_markdown",
  {
    title: "Web page as Markdown",
    description:
      "Fetch a web page from this computer and return it as clean Markdown: navigation, scripts, ads and styling removed, " +
      "every product of a grid kept, and schema.org Product/Offer data (name, price, currency, availability) as a table at the top. " +
      "Nothing is summarized, so prices, tables and specs come out exact. Pages that need JavaScript are opened in a real browser " +
      "(the installed Edge or Chrome) when the plain fetch comes back nearly empty or blocked. The whole page is always saved to a " +
      "Markdown file whose path is in the answer; long pages come back in parts (use offset), or ask for `find` to get only the lines " +
      "around a word. Public pages and local ones (localhost) work; no cookies or logins are sent.",
    inputSchema: {
      url: z.string().describe("The full address, with http:// or https://"),
      render: z
        .enum(["auto", "never", "always"])
        .default("auto")
        .describe("auto: a real browser only when the plain fetch is nearly empty or blocked. always: straight to the browser (SPAs). never: plain fetch only."),
      find: z.string().optional().describe("Only the lines containing this text (case-insensitive), with two lines around each."),
      offset: z.number().int().min(0).default(0).describe("Start at this character of the Markdown, to read a long page in parts."),
      max_chars: z.number().int().min(500).max(200_000).default(30_000).describe("At most this many characters in the answer."),
      save_to: z.string().optional().describe("Save the Markdown to this file too (otherwise only to the temporary folder)."),
      fresh: z.boolean().default(false).describe(`Skip the cache (pages are kept for ${Math.round(CACHE_MS / 60000)} minutes).`),
    },
  },
  async ({ url, render: mode, find, offset, max_chars, save_to, fresh }) => {
    try {
      let target: URL;
      try {
        target = new URL(url);
      } catch {
        throw new FetchError(`Not a URL: ${url}`);
      }
      if (target.protocol !== "http:" && target.protocol !== "https:") throw new FetchError("Only http:// and https:// addresses");

      const key = `${mode}|${target.href}`;
      const hit = cache.get(key);
      let page: Page;
      let cached = false;
      if (hit && !fresh && Date.now() - hit.at < CACHE_MS) {
        page = hit.page;
        cached = true;
      } else {
        page = await getPage(target.href, mode);
        cache.set(key, { at: Date.now(), page });
      }

      const file = fileFor(page.url);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, page.markdown, "utf8");
      if (save_to) {
        const dest = resolve(save_to);
        await mkdir(dirname(dest), { recursive: true });
        await writeFile(dest, page.markdown, "utf8");
      }

      const total = page.markdown.length;
      const head = [
        page.title ? `# ${page.title}` : "",
        `Source: ${page.url} · ${page.how}${cached ? " (cached)" : ""} · ${total.toLocaleString("en-US")} characters`,
        `Saved to: ${save_to ? resolve(save_to) : file}`,
      ].filter(Boolean);

      const landed = new URL(page.url);
      if (landed.href !== target.href && /login|signin|sign-in|account-verification|captcha|challenge|consent/i.test(landed.pathname + landed.search.slice(0, 80))) {
        head.push("", "Redirected to a login or verification page: the site does not let automated visits through. Nothing here is the page asked for.");
      } else if (textLength(page.markdown) < 50) {
        head.push("", "The page has almost no text: it may need a login, or show its content only after interaction.");
      }

      let body: string;
      if (find) {
        const found = grep(page.markdown, find);
        body = found ? found : `No line contains "${find}".`;
        if (body.length > max_chars) body = body.slice(0, max_chars) + `\n\n[Cut at ${max_chars} characters: narrow \`find\`, or read the saved file.]`;
      } else {
        body = page.markdown.slice(offset, offset + max_chars);
        const end = offset + body.length;
        if (offset > 0 || end < total) {
          head.push(`Part: characters ${offset.toLocaleString("en-US")}–${end.toLocaleString("en-US")} of ${total.toLocaleString("en-US")}` + (end < total ? `; for the rest, call again with offset ${end}.` : "."));
        }
      }

      return { content: [{ type: "text", text: head.join("\n") + "\n\n---\n\n" + body }] };
    } catch (e: any) {
      return { isError: true, content: [{ type: "text", text: e instanceof FetchError ? e.message : `Failed: ${e?.message ?? e}` }] };
    }
  }
);

async function main() {
  await server.connect(new StdioServerTransport());
  const bye = async () => {
    await closeBrowser();
    process.exit(0);
  };
  process.on("SIGINT", bye);
  process.on("SIGTERM", bye);
  process.stdin.on("close", bye);
}

main().catch((e) => {
  process.stderr.write(`[webtomd] ${e?.stack ?? e}\n`);
  process.exit(1);
});
