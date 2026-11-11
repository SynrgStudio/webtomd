# WebToMD

WebToMD is a lightweight, fast, and secure API that converts any webpage into clean, LLM-optimized Markdown. It bypasses ads, tracking scripts, and heavy styling to provide only the essential content, significantly reducing token usage for AI models.

## Features

- **Efficiency**: Reduces HTML token size by up to 90%.
- **Clean Output**: Removes scripts, styles, and non-essential elements.
- **Security**: Acts as a read-only agent; no JavaScript execution on target pages.
- **Easy Integration**: Simple GET request API.

## How to Use

Prepend the API URL to any webpage you want to convert, and send your access key:

```bash
curl -i -H "Authorization: Bearer $MD_KEY" https://md.synrgs.tech/v1/https://wikipedia.org/wiki/API
```

The server returns the content with `Content-Type: text/markdown`. `X-Api-Key: <key>` works too, for clients
that can't set `Authorization`.

## Access keys

The instance at md.synrgs.tech is private: `/v1/` answers `401` without a valid key. The landing page stays
public, and has a field to paste a key and fetch a page from the browser.

The keys live in the Worker's secret `MD_KEYS`, never in this repository. It holds one key per line, each with
the name of who uses it, so one person's access can be removed without touching the others:

```text
# comments and blank lines are ignored
alice = <a long random key>
bob   = <another one>
```

- **Make a key:** `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Keys shorter
  than 24 characters are ignored.
- **Set or change them:** put every line in a local file, outside the repository, and run
  `npx wrangler secret put MD_KEYS < that-file`. To revoke a key, delete its line and run it again.
- **See who uses it:** `npx wrangler tail` logs each request with the key's name and the target's host.

Without `MD_KEYS`, every `/v1/` request gets `503`: the Worker never runs open by mistake. To run your own
open instance, put a key of your own in it, or remove the check in `src/index.ts`.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for Cloudflare Workers development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SynrgStudio/webtomd.git
   cd webtomd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:

```bash
npm start
```

This will run the worker locally using Wrangler. You can then access the landing page or use the API at `http://localhost:8787`.

### Testing

Run the test suite using Vitest:

```bash
npm test
```

## Deployment

This project is designed to be deployed as a **Cloudflare Worker**.

To deploy to your own Cloudflare account:

```bash
npm run deploy
```

Make sure you have configured your `wrangler.toml` with the appropriate settings.

## License

MIT
