// Talks to bin/webtomd-mcp.mjs as an MCP client would, over stdio.
//   node mcp/smoke.mjs https://example.com [render=auto] [find=word]
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const [url = "https://example.com", ...rest] = process.argv.slice(2);
const args = { url, max_chars: 1500 };
for (const r of rest) {
  const [k, v] = r.split("=");
  args[k] = /^\d+$/.test(v) ? +v : v;
}

const client = new Client({ name: "smoke", version: "0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: ["bin/webtomd-mcp.mjs"], stderr: "inherit" }));
const { tools } = await client.listTools();
console.log("tools:", tools.map((t) => t.name).join(", "));
const t0 = Date.now();
const res = await client.callTool({ name: "fetch_markdown", arguments: args });
console.log(`${Date.now() - t0} ms${res.isError ? " · ERROR" : ""}\n` + res.content[0].text);
await client.close();
