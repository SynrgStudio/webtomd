# WebToMD

- `bin/webtomd-mcp.mjs` is generated and committed (npm publishes it; installs build nothing): run `npm run build:mcp`
  after any change to `mcp/` or `src/extract/`, and commit the result.
- `src/ui/landing.ts` is generated: edit `src/ui/landing.html`, then `npm run build:landing`.
- Check the bundled server with `node mcp/smoke.mjs <url> [render=always] [find=word]`.
- Runtime dependencies stay at playwright-core only: everything else is bundled, so it goes in devDependencies.
- The MCP server writes only protocol to stdout; logs go to stderr.
- Deploy the Worker with `npm run deploy` (md.synrgs.tech). `/v1/` stays private (keys in the `MD_KEYS` secret).
- Release to npm as `webtomd-mcp` (the name `webtomd` there is someone else's): bump `version` in package.json, `npm publish` (prepublishOnly builds and tests), commit and push.
