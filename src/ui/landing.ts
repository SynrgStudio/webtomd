// Written by build-landing.mjs from landing.html: edit that file, not this one.
export function getLandingHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>WebToMD — any web page as Markdown, for your AI agent</title>
<meta name="description" content="WebToMD is an MCP server that runs on your computer: give your agent a URL, get the page back as clean Markdown. Nothing summarized, prices and tables exact, JavaScript pages opened in a real browser.">
<meta property="og:title" content="WebToMD — any web page as Markdown, for your AI agent">
<meta property="og:description" content="A local MCP server: clean Markdown from any page, nothing summarized.">
<meta property="og:url" content="https://md.synrgs.tech/">
<meta name="theme-color" content="#09090b">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2309090b'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-family='monospace' font-size='15' font-weight='700' fill='%23fff'%3EM%E2%86%93%3C/text%3E%3C/svg%3E">
<style>
  :root {
    --bg: #09090b; --panel: #111114; --panel-2: #17171b; --line: #26262b; --line-2: #33333a;
    --text: #d4d4d8; --dim: #a1a1aa; --faint: #71717a; --white: #fafafa; --ok: #4ade80; --accent: #fafafa;
    --mono: ui-monospace, "Cascadia Code", "JetBrains Mono", SFMono-Regular, Menlo, Consolas, monospace;
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.6 var(--sans); -webkit-font-smoothing: antialiased; }
  body::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: -1;
    background: radial-gradient(60% 40% at 80% 0%, rgba(250,250,250,.06), transparent 70%),
                linear-gradient(rgba(250,250,250,.025) 1px, transparent 1px) 0 0 / 100% 32px; }
  a { color: inherit; }
  ::selection { background: var(--white); color: #000; }
  .wrap { width: min(1120px, 100% - 32px); margin: 0 auto; }
  code, pre, .mono { font-family: var(--mono); font-variant-ligatures: none; font-feature-settings: "calt" 0, "liga" 0; }

  header.top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 0; }
  .brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; color: var(--white); text-decoration: none; letter-spacing: -.01em; }
  .brand i { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid var(--line-2); border-radius: 6px; font: 700 12px var(--mono); font-style: normal; }
  nav.links { display: flex; gap: 20px; font-size: .88rem; color: var(--dim); }
  nav.links a { text-decoration: none; }
  nav.links a:hover { color: var(--white); }

  .hero { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: 56px; align-items: center; padding: 56px 0 72px; }
  .kicker { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 18px; font: 500 .74rem var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--dim); }
  .kicker b { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 4px rgba(74,222,128,.15); }
  h1 { margin: 0 0 20px; color: var(--white); font-size: clamp(2.3rem, 5.4vw, 4rem); line-height: 1.02; letter-spacing: -.04em; font-weight: 800; text-wrap: balance; }
  h1 span { color: var(--faint); }
  .lede { margin: 0 0 30px; max-width: 34em; font-size: 1.1rem; color: var(--dim); }
  .lede strong { color: var(--white); font-weight: 600; }

  .cmd { position: relative; display: flex; align-items: center; gap: 12px; padding: 14px 14px 14px 18px; border: 1px solid var(--line-2); background: var(--panel); border-radius: 10px; }
  .cmd code { flex: 1; min-width: 0; overflow-wrap: anywhere; color: var(--white); font-size: .9rem; line-height: 1.5; }
  .cmd code .p { color: var(--faint); user-select: none; }
  .copy { flex: none; border: 1px solid var(--line-2); background: var(--panel-2); color: var(--text); border-radius: 7px; padding: 7px 12px; font: 500 .78rem var(--mono); cursor: pointer; }
  .copy:hover { color: var(--white); border-color: var(--faint); }
  .copy.done { color: var(--ok); border-color: rgba(74,222,128,.4); }
  .needs { margin: 12px 0 0; font-size: .85rem; color: var(--faint); }
  .needs a { color: var(--dim); }

  /* The demo: what goes in, what comes out */
  .demo { border: 1px solid var(--line); border-radius: 14px; background: var(--panel); overflow: hidden; box-shadow: 0 40px 80px -40px rgba(0,0,0,.9); }
  .demo-bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid var(--line); font: .72rem var(--mono); color: var(--faint); }
  .demo-bar i { width: 9px; height: 9px; border-radius: 50%; background: var(--line-2); }
  .demo-bar span { margin-left: 8px; }
  .demo pre { margin: 0; padding: 18px 20px; font-size: .78rem; line-height: 1.65; overflow-x: auto; color: var(--text); }
  .demo .call { color: var(--dim); border-bottom: 1px dashed var(--line); }
  .k { color: var(--faint); } .s { color: #a5f3fc; } .h { color: var(--white); font-weight: 700; } .n { color: #fcd34d; } .m { color: var(--faint); }

  section.block { padding: 72px 0; border-top: 1px solid var(--line); }
  .sec-head { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 32px; margin-bottom: 36px; }
  .sec-n { font: .74rem var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--faint); padding-top: 10px; }
  h2 { margin: 0; color: var(--white); font-size: clamp(1.7rem, 3.4vw, 2.4rem); letter-spacing: -.03em; line-height: 1.1; font-weight: 750; text-wrap: balance; }
  .sec-head p { margin: 12px 0 0; color: var(--dim); max-width: 40em; }

  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
  .cell { padding: 26px 24px 28px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .cell h3 { margin: 0 0 8px; color: var(--white); font-size: 1.05rem; letter-spacing: -.01em; }
  .cell p { margin: 0; color: var(--dim); font-size: .95rem; }
  .cell .tag { display: block; margin-bottom: 14px; font: .7rem var(--mono); color: var(--faint); }
  .cell code { font-size: .85em; color: var(--white); }

  .tabs { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--panel); }
  .tabs input { position: absolute; opacity: 0; pointer-events: none; }
  .tab-row { display: flex; flex-wrap: wrap; border-bottom: 1px solid var(--line); }
  .tab-row label { padding: 12px 18px; font: 500 .8rem var(--mono); color: var(--faint); cursor: pointer; border-right: 1px solid var(--line); }
  .tab-row label:hover { color: var(--text); }
  .pane { display: none; padding: 22px 22px 24px; }
  .pane p { margin: 0 0 14px; color: var(--dim); font-size: .95rem; }
  .pane p:last-child { margin-bottom: 0; }
  .pane pre { white-space: pre-wrap; overflow-wrap: anywhere; margin: 0 0 14px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); overflow-x: auto; font-size: .82rem; color: var(--white); }
  #t1:checked ~ .tab-row [for=t1], #t2:checked ~ .tab-row [for=t2], #t3:checked ~ .tab-row [for=t3], #t4:checked ~ .tab-row [for=t4] { color: var(--white); background: var(--panel-2); box-shadow: inset 0 -2px 0 var(--white); }
  #t1:checked ~ .p1, #t2:checked ~ .p2, #t3:checked ~ .p3, #t4:checked ~ .p4 { display: block; }
  .tabs input:focus-visible ~ .tab-row { outline: 1px solid var(--faint); }

  table { width: 100%; border-collapse: collapse; font-size: .92rem; }
  th, td { text-align: left; vertical-align: top; padding: 12px 14px; border-bottom: 1px solid var(--line); }
  th { font: 500 .72rem var(--mono); letter-spacing: .06em; text-transform: uppercase; color: var(--faint); }
  td:first-child { white-space: nowrap; }
  td code { color: var(--white); }
  td .d { color: var(--faint); font-family: var(--mono); font-size: .8rem; }
  .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
  .table-wrap tr:last-child td { border-bottom: 0; }

  .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .note { padding: 22px 24px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
  .note h3 { margin: 0 0 10px; color: var(--white); font-size: 1rem; }
  .note ul { margin: 0; padding-left: 18px; color: var(--dim); font-size: .93rem; }
  .note li { margin: 6px 0; }
  .note code { color: var(--white); font-size: .85em; }

  footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; padding: 32px 0 48px; border-top: 1px solid var(--line); color: var(--faint); font-size: .85rem; }
  footer a { color: var(--dim); }

  @media (max-width: 860px) {
    .hero { grid-template-columns: minmax(0, 1fr); gap: 40px; padding: 32px 0 56px; }
    .sec-head { grid-template-columns: minmax(0, 1fr); gap: 8px; }
    .sec-n { padding-top: 0; }
    .grid { grid-template-columns: minmax(0, 1fr); }
    .two { grid-template-columns: minmax(0, 1fr); }
    nav.links { display: none; }
    section.block { padding: 56px 0; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <a class="brand" href="/"><i>M↓</i>WebToMD</a>
    <nav class="links">
      <a href="#install">Install</a>
      <a href="#tool">The tool</a>
      <a href="#limits">Limits</a>
      <a href="https://github.com/SynrgStudio/webtomd" rel="noopener">GitHub</a>
    </nav>
  </header>

  <section class="hero">
    <div>
      <p class="kicker"><b></b>MCP server · runs on your computer</p>
      <h1>Any web page, as Markdown <span>your agent can actually read.</span></h1>
      <p class="lede">Give your AI agent a URL and it gets the page back as clean Markdown: no menus, scripts or ads, and <strong>nothing summarized</strong>, so prices, tables and specs come out exact. Pages that only exist after their JavaScript runs are opened in a real browser.</p>
      <div class="cmd">
        <code><span class="p">$ </span>claude mcp add webtomd -- npx -y github:SynrgStudio/webtomd</code>
        <button class="copy" type="button" data-copy="claude mcp add webtomd -- npx -y github:SynrgStudio/webtomd">Copy</button>
      </div>
      <p class="needs">Needs <a href="https://nodejs.org/" rel="noopener">Node.js 20</a> or newer and Git. The first start downloads everything else. <a href="#install">Other apps</a></p>
    </div>

    <div class="demo" aria-label="An example call and its answer">
      <div class="demo-bar"><i></i><i></i><i></i><span>fetch_markdown</span></div>
<pre><span class="call"><span class="k">url</span> <span class="s">"https://shop.example/mugs"</span></span>

<span class="h"># Mugs — Example Shop</span>
<span class="m">Source: https://shop.example/mugs · fetched · 18,204 characters
Saved to: …\\Temp\\webtomd\\shop-example-mugs-3f9a1c20.md</span>

<span class="h">## Structured product data (JSON-LD)</span>

| Product           | Price  | Availability |
|---|---|---|
| Stoneware mug 350 | <span class="n">24 USD</span> | InStock      |
| Stoneware mug 500 | <span class="n">29 USD</span> | OutOfStock   |

<span class="m">---</span>

<span class="h">### Stoneware mug 350 ml</span>
Glazed by hand. <span class="n">$32.00 $24.00</span>
Add to cart</pre>
    </div>
  </section>

  <section class="block" id="why">
    <div class="sec-head">
      <p class="sec-n">01 · What you get</p>
      <div>
        <h2>The page itself, not a summary of it.</h2>
        <p>Most web tools hand the model a paraphrase. WebToMD hands it the page, cleaned, and keeps a copy on disk.</p>
      </div>
    </div>
    <div class="grid">
      <div class="cell"><span class="tag">exact</span><h3>Nothing summarized</h3><p>Numbers survive: list prices next to sale prices, every row of a table, every product of a grid.</p></div>
      <div class="cell"><span class="tag">stores</span><h3>Prices from the source</h3><p>When a page carries schema.org Product data, it comes first as a table: name, price, currency, availability.</p></div>
      <div class="cell"><span class="tag">javascript</span><h3>A real browser when needed</h3><p>If the plain fetch comes back nearly empty or blocked, the page opens in the Edge or Chrome you already have.</p></div>
      <div class="cell"><span class="tag">long pages</span><h3>In parts, or just the lines you need</h3><p>Long pages come back in parts with an <code>offset</code>; <code>find</code> returns only the lines around a word.</p></div>
      <div class="cell"><span class="tag">on disk</span><h3>A file for every page</h3><p>The whole page is saved as a Markdown file, so the agent can search it again without fetching it twice.</p></div>
      <div class="cell"><span class="tag">local</span><h3>No key, no quota</h3><p>It runs on your computer and fetches from your connection. Nothing goes through our servers.</p></div>
    </div>
  </section>

  <section class="block" id="install">
    <div class="sec-head">
      <p class="sec-n">02 · Install</p>
      <div>
        <h2>One line, then ask for a page.</h2>
        <p>Every app below starts it the same way: <code>npx</code> downloads WebToMD from GitHub the first time and keeps it. Then ask your agent something like “read this page and compare the prices”.</p>
      </div>
    </div>
    <div class="tabs">
      <input type="radio" name="t" id="t1" checked><input type="radio" name="t" id="t2"><input type="radio" name="t" id="t3"><input type="radio" name="t" id="t4">
      <div class="tab-row"><label for="t1">Claude Code</label><label for="t2">Claude Desktop</label><label for="t3">Cursor · VS Code</label><label for="t4">Codex</label></div>
      <div class="pane p1">
        <pre>claude mcp add --scope user webtomd -- npx -y github:SynrgStudio/webtomd</pre>
        <p><code>--scope user</code> makes it available in every project. Check it with <code>claude mcp list</code>.</p>
      </div>
      <div class="pane p2">
        <p>Settings → Developer → Edit Config, then add it to <code>claude_desktop_config.json</code> and restart the app:</p>
<pre>{
  "mcpServers": {
    "webtomd": {
      "command": "npx",
      "args": ["-y", "github:SynrgStudio/webtomd"]
    }
  }
}</pre>
        <p>If Windows can't start <code>npx</code>, use <code>"command": "cmd"</code> and <code>"args": ["/c", "npx", "-y", "github:SynrgStudio/webtomd"]</code>.</p>
      </div>
      <div class="pane p3">
        <p>Cursor: <code>~/.cursor/mcp.json</code>. VS Code: <code>.vscode/mcp.json</code> (with <code>"servers"</code> instead of <code>"mcpServers"</code>).</p>
<pre>{
  "mcpServers": {
    "webtomd": { "command": "npx", "args": ["-y", "github:SynrgStudio/webtomd"] }
  }
}</pre>
      </div>
      <div class="pane p4">
        <p>In <code>~/.codex/config.toml</code>:</p>
<pre>[mcp_servers.webtomd]
command = "npx"
args = ["-y", "github:SynrgStudio/webtomd"]</pre>
      </div>
    </div>
  </section>

  <section class="block" id="tool">
    <div class="sec-head">
      <p class="sec-n">03 · The tool</p>
      <div>
        <h2><code>fetch_markdown</code></h2>
        <p>One tool. Only <code>url</code> is required; the rest is there when a page is long, stubborn or both.</p>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Argument</th><th>What it does</th></tr></thead>
        <tbody>
          <tr><td><code>url</code></td><td>The full address, with <code>https://</code>. Local pages (<code>localhost</code>) work too.</td></tr>
          <tr><td><code>render</code> <span class="d">auto</span></td><td><code>auto</code> opens a browser only when the plain fetch is nearly empty or blocked; <code>always</code> goes straight to it; <code>never</code> doesn't.</td></tr>
          <tr><td><code>find</code></td><td>Only the lines with this text, two lines around each, numbered.</td></tr>
          <tr><td><code>offset</code> <span class="d">0</span></td><td>Where to start in the Markdown, to read a long page in parts. The answer says where the next part starts.</td></tr>
          <tr><td><code>max_chars</code> <span class="d">30000</span></td><td>The most characters in one answer.</td></tr>
          <tr><td><code>save_to</code></td><td>Also save the Markdown to this file.</td></tr>
          <tr><td><code>fresh</code> <span class="d">false</span></td><td>Fetch again instead of using the copy kept for an hour.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="block" id="limits">
    <div class="sec-head">
      <p class="sec-n">04 · Good to know</p>
      <div>
        <h2>What it does, and what it won't.</h2>
      </div>
    </div>
    <div class="two">
      <div class="note">
        <h3>Limits</h3>
        <ul>
          <li>No cookies or logins are sent: pages behind an account stay closed.</li>
          <li>Some sites stop automated visits even in a real browser. WebToMD says so when it lands on a login or verification page.</li>
          <li>Requests leave from your own connection, like your browser's.</li>
          <li>Only web pages: a PDF or an image is reported, not converted.</li>
        </ul>
      </div>
      <div class="note">
        <h3>Settings</h3>
        <ul>
          <li><code>WEBTOMD_DIR</code>: where pages are saved (the system's temporary folder by default).</li>
          <li><code>WEBTOMD_CACHE_S</code>: how long a page is kept, in seconds (3600).</li>
          <li><code>WEBTOMD_BROWSER</code>: the path of a browser to use instead of Edge or Chrome.</li>
          <li>With no Edge or Chrome, the first JavaScript page downloads a headless Chromium once (about 100 MB).</li>
        </ul>
      </div>
    </div>
  </section>

  <footer>
    <span>WebToMD · open source, by <a href="https://synrgs.tech" rel="noopener">SynrgStudio</a></span>
    <a href="https://github.com/SynrgStudio/webtomd" rel="noopener">github.com/SynrgStudio/webtomd</a>
  </footer>
</div>
<script>
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      navigator.clipboard.writeText(b.getAttribute("data-copy")).then(function () {
        b.textContent = "Copied"; b.classList.add("done");
        setTimeout(function () { b.textContent = "Copy"; b.classList.remove("done"); }, 1600);
      });
    });
  });
</script>
</body>
</html>
`;
}
