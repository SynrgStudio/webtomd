import { describe, it, expect } from "vitest";
import worker from "../src/index";
import { keyOwner, parseKeys } from "../src/lib/auth";

const KEY_A = "a".repeat(20) + "-clave-de-prueba-uno";
const KEY_B = "b".repeat(20) + "-clave-de-prueba-dos";
const MD_KEYS = `# comentario\n\ndamian = ${KEY_A}\namigo=${KEY_B}\ncorta = 123\n`;

const ctx = { waitUntil() {}, passThroughOnException() {} } as unknown as ExecutionContext;

// Una URL de destino inválida: si la clave pasa, el Worker contesta 400 sin salir a la red.
const blocked = "https://md.synrgs.tech/v1/http://localhost:3000";

describe("Claves", () => {
  it("lee una clave por línea, ignora comentarios y claves cortas", async () => {
    const keys = await parseKeys(MD_KEYS);
    expect(keys.map((k) => k.name)).toEqual(["damian", "amigo"]);
  });

  it("reconoce al dueño de la clave, por Authorization o por X-Api-Key", async () => {
    const keys = await parseKeys(MD_KEYS);
    expect(await keyOwner(new Request(blocked, { headers: { Authorization: `Bearer ${KEY_A}` } }), keys)).toBe("damian");
    expect(await keyOwner(new Request(blocked, { headers: { "X-Api-Key": KEY_B } }), keys)).toBe("amigo");
    expect(await keyOwner(new Request(blocked, { headers: { Authorization: `Bearer ${KEY_A}x` } }), keys)).toBe(null);
    expect(await keyOwner(new Request(blocked), keys)).toBe(null);
  });
});

describe("/v1/ es privado", () => {
  it("sin clave contesta 401", async () => {
    const res = await worker.fetch(new Request(blocked), { MD_KEYS }, ctx);
    expect(res.status).toBe(401);
    expect(res.headers.get("WWW-Authenticate")).toContain("Bearer");
  });

  it("con una clave equivocada contesta 401", async () => {
    const res = await worker.fetch(new Request(blocked, { headers: { Authorization: "Bearer " + "z".repeat(40) } }), { MD_KEYS }, ctx);
    expect(res.status).toBe(401);
  });

  it("con la clave pasa al resto de los controles", async () => {
    const res = await worker.fetch(new Request(blocked, { headers: { Authorization: `Bearer ${KEY_A}` } }), { MD_KEYS }, ctx);
    expect(res.status).toBe(400);
  });

  it("sin claves configuradas no deja pasar a nadie", async () => {
    const res = await worker.fetch(new Request(blocked, { headers: { Authorization: `Bearer ${KEY_A}` } }), {}, ctx);
    expect(res.status).toBe(503);
  });

  it("la landing sigue pública", async () => {
    const res = await worker.fetch(new Request("https://md.synrgs.tech/"), {}, ctx);
    expect(res.status).toBe(200);
  });
});
