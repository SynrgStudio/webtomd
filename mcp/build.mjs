// Bundles the MCP server into one file, bin/webtomd-mcp.mjs, which is committed:
// installing from GitHub then needs no build, only playwright-core (loaded the
// first time a page needs a browser).
import { build } from "esbuild";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

await build({
  entryPoints: ["mcp/server.ts"],
  outfile: "bin/webtomd-mcp.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  external: ["playwright-core"],
  define: { __VERSION__: JSON.stringify(version) },
  banner: {
    js: "#!/usr/bin/env node\nimport { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);",
  },
  legalComments: "none",
  minify: true,
  logLevel: "info",
});
