import { describe, it, expect } from "vitest";
import { isValidTargetUrl } from "../src/lib/validateTargetUrl";

describe("Validación de URLs", () => {
  it("acepta URLs públicas HTTP/HTTPS", () => {
    expect(isValidTargetUrl("https://example.com")).toBe(true);
    expect(isValidTargetUrl("http://wikipedia.org/wiki/Page")).toBe(true);
  });

  it("rechaza esquemas no web", () => {
    expect(isValidTargetUrl("ftp://server.com")).toBe(false);
    expect(isValidTargetUrl("file:///C:/autoexec.bat")).toBe(false);
    expect(isValidTargetUrl("javascript:alert(1)")).toBe(false);
  });

  it("rechaza localhost y loopback", () => {
    expect(isValidTargetUrl("http://localhost:3000")).toBe(false);
    expect(isValidTargetUrl("http://127.0.0.1")).toBe(false);
    expect(isValidTargetUrl("http://[::1]")).toBe(false);
  });

  it("rechaza IPs privadas rudimentarias", () => {
    expect(isValidTargetUrl("http://192.168.1.1")).toBe(false);
    expect(isValidTargetUrl("http://10.0.0.1")).toBe(false);
    expect(isValidTargetUrl("http://172.16.0.1")).toBe(false);
  });

  it("maneja strings inválidas", () => {
    expect(isValidTargetUrl("not_a_url")).toBe(false);
  });
});
