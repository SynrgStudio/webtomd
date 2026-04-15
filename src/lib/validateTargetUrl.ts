export function isValidTargetUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    
    // Solo HTTP y HTTPS
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    // Bloquear localhost
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1" || url.hostname === "[::1]") {
      return false;
    }

    // Bloquear IPs privadas (rudimentario)
    if (url.hostname.startsWith("10.") || url.hostname.startsWith("192.168.")) {
      return false;
    }
    // 172.16.x.x a 172.31.x.x
    if (url.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
      return false;
    }

    return true;
  } catch (e) {
    // Si no es URL válida
    return false;
  }
}
