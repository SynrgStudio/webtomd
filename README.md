# WebToMD

WebToMD is a lightweight, fast, and secure API that converts any webpage into clean, LLM-optimized Markdown. It bypasses ads, tracking scripts, and heavy styling to provide only the essential content, significantly reducing token usage for AI models.

## Features

- **Efficiency**: Reduces HTML token size by up to 90%.
- **Clean Output**: Removes scripts, styles, and non-essential elements.
- **Security**: Acts as a read-only agent; no JavaScript execution on target pages.
- **Easy Integration**: Simple GET request API.

## How to Use

Simply prepend the API URL to any webpage you want to convert:

```bash
curl -i https://md.synrg.me/v1/https://wikipedia.org/wiki/API
```

The server returns the content with `Content-Type: text/markdown`.

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
