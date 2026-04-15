import { getLandingHtml } from "./ui/landing";
import { htmlToCleanMarkdown } from "./extract/htmlToMarkdown";
import { createErrorResponse } from "./responses/errors";
import { isValidTargetUrl } from "./lib/validateTargetUrl";

export interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Ruta: /
    if (url.pathname === "/") {
      return new Response(getLandingHtml(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Ruta: /v1/*
    if (url.pathname.startsWith("/v1/")) {
      const targetUrl = url.pathname.slice(4) + url.search;

      if (!isValidTargetUrl(targetUrl)) {
        return createErrorResponse(
          "URL Inválida o Bloqueada",
          "La URL proporcionada no es válida o pertenece a un rango de red no permitido (ej. localhost/red privada).",
          400
        );
      }
      
      // Cache handler (solo GET)
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);
      if (request.method === "GET") {
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      try {
        const fetchResponse = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          }
        });

        if (!fetchResponse.ok) {
          return createErrorResponse(
            "Fallo al obtener contenido",
            `El servidor destino devolvió un error HTTP ${fetchResponse.status} ${fetchResponse.statusText}.`,
            fetchResponse.status
          );
        }

        const html = await fetchResponse.text();
        const markdown = htmlToCleanMarkdown(html);

        if (!markdown || markdown.trim() === "") {
          return createErrorResponse(
            "Contenido no encontrado (Posible SPA)",
            "La página parece estar vacía o requiere JavaScript del lado del cliente (SPA pura sin SSR) para renderizar el contenido.",
            400
          );
        }

        const finalResponse = new Response(markdown, {
          headers: { 
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600" // 1 hora de caché
          },
        });

        // Guardar en caché
        if (request.method === "GET") {
          ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
        }

        return finalResponse;
      } catch (e: any) {
        return createErrorResponse(
          "Error de Conexión",
          `Fallo al acceder a la URL objetivo.\n\nDetalles: ${e.message}`,
          500
        );
      }
    }

    // Fallback 404
    return new Response("Not Found", { status: 404 });
  },
};
