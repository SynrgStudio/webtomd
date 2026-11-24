# WebToMD

Any web page as clean Markdown for your AI agent. WebToMD is an MCP server that runs on your computer: give it a
URL and it returns the page without menus, scripts, ads or styling, and **nothing summarized**, so prices, tables
and specs come out exact. Pages that only exist after their JavaScript runs are opened in a real browser.

Site: [md.synrgs.tech](https://md.synrgs.tech)

## Install

Needs [Node.js](https://nodejs.org/) 20 or newer. `npx` downloads WebToMD from npm the first time and
keeps it.

**Claude Code**

```bash
claude mcp add --scope user webtomd -- npx -y webtomd-mcp
```

On Windows, through `cmd`: `claude mcp add --scope user webtomd -- cmd /c npx -y webtomd-mcp`.

**Claude Desktop, Cursor and others** (`claude_desktop_config.json`, `~/.cursor/mcp.json`; VS Code uses `"servers"`):

```json
{
  "mcpServers": {
    "webtomd": { "command": "npx", "args": ["-y", "webtomd-mcp"] }
  }
}
```

On Windows, if the app can't start `npx`: `"command": "cmd"`, `"args": ["/c", "npx", "-y", "webtomd-mcp"]`.

**Codex** (`~/.codex/config.toml`):

```toml
[mcp_servers.webtomd]
command = "npx"
args = ["-y", "webtomd-mcp"]
```

## The tool: `fetch_markdown`

| Argument | Default | What it does |
|---|---|---|
| `url` | | The full address, with `https://`. Local pages (`localhost`) work too. |
| `render` | `auto` | `auto` opens a browser only when the plain fetch is nearly empty or blocked; `always` goes straight to it; `never` doesn't. |
| `find` | | Only the lines with this text, two lines around each, numbered. |
| `offset` | `0` | Where to start in the Markdown, to read a long page in parts. |
| `max_chars` | `30000` | The most characters in one answer. |
| `save_to` | | Also save the Markdown to this file. |
| `fresh` | `false` | Fetch again instead of using the copy kept for an hour. |

Every answer starts with the page's title, its final address, how it was read (fetched, or rendered in Edge,
Chrome or Chromium) and the file where the whole page was saved. When a page carries schema.org Product data,
a table with name, price, currency and availability comes first.

**The browser.** WebToMD uses the Edge or Chrome already installed. With neither, the first page that needs one
downloads Playwright's headless Chromium (about 100 MB), once.

**Settings** (environment variables): `WEBTOMD_DIR` where pages are saved (the system's temporary folder),
`WEBTOMD_CACHE_S` how long a page is kept (3600 seconds), `WEBTOMD_BROWSER` the path of a browser to use instead.

**Limits.** No cookies or logins are sent. Some sites stop automated visits even in a real browser; WebToMD says
so when it lands on a login or verification page. Requests leave from your own connection. A PDF or an image is
reported, not converted.

## How it is built

- `src/extract/`: the extractor, HTML to Markdown with cheerio and html-to-md. Shared by the MCP server and the
  Worker.
- `mcp/`: the MCP server (`server.ts`) and the browser (`browser.ts`, playwright-core). `npm run build:mcp` bundles
  them into `bin/webtomd-mcp.mjs`, which is what npm publishes (and is committed): installing builds nothing, and the only
  dependency it downloads is playwright-core.
- `src/index.ts`: the Cloudflare Worker behind md.synrgs.tech. It serves the landing page (`src/ui/landing.html`,
  turned into `landing.ts` by `npm run build:landing`) and the private `/v1/` API.

```bash
npm install
npm test                                  # the extractor and the Worker
npm run build:mcp                         # after changing mcp/ or src/extract/
node mcp/smoke.mjs https://example.com    # the bundled server, as an MCP client sees it (also render=always, find=word)
npm run dev                               # the Worker at http://localhost:8787
npm run deploy                            # the Worker to Cloudflare
```

## The hosted API

md.synrgs.tech also answers `GET /v1/<url>` with the page as Markdown, for whoever has a key:

```bash
curl -H "Authorization: Bearer $MD_KEY" https://md.synrgs.tech/v1/https://wikipedia.org/wiki/API
```

It is private: the keys live in the Worker's secret `MD_KEYS`, one per line as `name = key` (keys shorter than 24
characters are ignored). Set them with `npx wrangler secret put MD_KEYS < file-outside-the-repo`; to revoke one,
delete its line and run it again. `npx wrangler tail` logs each request with the key's name and the target's host.
Without `MD_KEYS`, `/v1/` answers `503`. It runs on Cloudflare's free plan, so very large pages can hit its CPU
limit; the MCP server has no such limit.

## License

MIT
