// A real browser, for pages that only exist after their JavaScript runs.
// It uses the Edge or Chrome already installed; with neither, it downloads
// Playwright's headless Chromium once (about 100 MB) and keeps it.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

type Browser = import("playwright-core").Browser;

export interface Rendered {
  html: string;
  finalUrl: string;
  status: number;
  browser: string;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
const IDLE_MS = 5 * 60_000; // close the browser after five minutes without a page

let current: Promise<{ browser: Browser; label: string }> | null = null;
let idle: NodeJS.Timeout | null = null;

function log(msg: string) {
  // stdout belongs to the MCP protocol: everything else goes to stderr.
  process.stderr.write(`[webtomd] ${msg}\n`);
}

async function launch(): Promise<{ browser: Browser; label: string }> {
  const { chromium } = await import("playwright-core");
  const tries: [string, Parameters<typeof chromium.launch>[0]][] = [];
  if (process.env.WEBTOMD_BROWSER) tries.push(["WEBTOMD_BROWSER", { executablePath: process.env.WEBTOMD_BROWSER }]);
  tries.push(["Edge", { channel: "msedge" }], ["Chrome", { channel: "chrome" }], ["Chromium", {}]);
  for (const [label, opts] of tries) {
    try {
      return { browser: await chromium.launch({ headless: true, ...opts }), label };
    } catch {
      // not installed here: try the next one
    }
  }
  log("no Edge or Chrome found: downloading Playwright's headless Chromium, once");
  await installChromium();
  return { browser: await chromium.launch({ headless: true }), label: "Chromium" };
}

function installChromium(): Promise<void> {
  const require = createRequire(import.meta.url);
  const cli = join(dirname(require.resolve("playwright-core/package.json")), "cli.js");
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, "install", "chromium", "--only-shell", "--no-progress"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (d) => process.stderr.write(d));
    child.stderr.on("data", (d) => process.stderr.write(d));
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`the Chromium download failed (exit ${code})`))));
  });
}

async function getBrowser() {
  if (!current) {
    current = launch().catch((e) => {
      current = null;
      throw e;
    });
  }
  const b = await current;
  if (!b.browser.isConnected()) {
    current = null;
    return getBrowser();
  }
  return b;
}

export async function closeBrowser() {
  const c = current;
  current = null;
  if (c) await (await c).browser.close().catch(() => {});
}

export async function render(url: string, timeoutMs = 30_000): Promise<Rendered> {
  if (idle) clearTimeout(idle);
  const { browser, label } = await getBrowser();
  const context = await browser.newContext({ userAgent: UA, locale: "en-US", viewport: { width: 1280, height: 900 } });
  try {
    const page = await context.newPage();
    // The text is what matters: no images, video or fonts.
    await page.route("**/*", (route) =>
      ["image", "media", "font"].includes(route.request().resourceType()) ? route.abort() : route.continue()
    );
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
    // Lazy lists load as they come into view.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
    await page.waitForTimeout(600);
    return { html: await page.content(), finalUrl: page.url(), status: res?.status() ?? 0, browser: label };
  } finally {
    await context.close().catch(() => {});
    idle = setTimeout(() => void closeBrowser(), IDLE_MS);
    idle.unref();
  }
}
