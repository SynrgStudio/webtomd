import * as cheerio from "cheerio";
import html2md from "html-to-md";
import { extractStructuredProducts, productsToMarkdown } from "./structuredData";

type CheerioRoot = ReturnType<typeof cheerio.load>;

export function htmlToCleanMarkdown(html: string): string {
  // Load HTML into Cheerio
  const $ = cheerio.load(html);

  // JSON-LD vive en <script>, así que hay que leerlo ANTES de limpiar el ruido.
  // Muchas tiendas exponen ahí el schema Product/Offer con el precio limpio.
  const products = extractStructuredProducts($);

  // Remove noise elements
  const noiseSelectors = [
    "script",
    "style",
    "noscript",
    "iframe",
    "nav",
    "footer",
    "header",
    "aside",
    "svg",
    "[role='dialog']",
    "[role='banner']",
    "[role='navigation']",
    "[role='contentinfo']",
    // Solo los forms que son ruido: búsqueda, newsletter, login.
    // Los forms de "agregar al carrito" suelen envolver nombre y precio del producto.
    "form[role='search']",
    "form:has(input[type='search'])",
    "form:has(input[type='email'])",
    "form:has(input[type='password'])",
    // Controles de formulario que quedan dentro de los forms conservados
    "input",
    "select",
    "textarea",
  ];
  $(noiseSelectors.join(",")).remove();

  // html-to-md descarta el contenido de <form>: desenvolvemos los que quedaron
  // (dejamos sus hijos en el lugar) para no perder nombre/precio del producto.
  $("form").each((_, el) => {
    $(el).replaceWith($(el).contents());
  });

  const content = pickMainContent($)
    // html-to-md no trata <article> como bloque y pega un producto con el siguiente
    .replace(/<article\b/gi, "<section")
    .replace(/<\/article>/gi, "</section>");
  const body = content && content.trim() ? html2md(content).trim() : "";
  const structured = productsToMarkdown(products);

  return [structured, body].filter(Boolean).join("\n\n---\n\n").trim();
}

function pickMainContent($: CheerioRoot): string {
  const articles = $("article");

  // Una sola <article>: es el contenido (caso blog/noticia).
  if (articles.length === 1) {
    const html = articles.first().html();
    if (html && html.trim()) return html;
  }

  // Varias <article> (grilla de productos, listado de posts):
  // si están dentro de <main>, usamos <main> para conservar títulos y contexto;
  // si no, concatenamos todas, no solo la primera.
  if (articles.length > 1) {
    const main = $("main").first();
    if (main.length && main.find("article").length > 0) {
      const html = main.html();
      if (html && html.trim()) return html;
    }
    const joined = articles
      .toArray()
      .filter((el) => !articles.toArray().some((other) => other !== el && $(other).find(el).length > 0)) // evita duplicar <article> anidadas
      .map((el) => $(el).html() || "")
      .filter((h) => h.trim())
      .join("\n<hr>\n");
    if (joined.trim()) return joined;
  }

  const mainHtml = $("main").first().html();
  if (mainHtml && mainHtml.trim()) return mainHtml;

  // Fallback: el contenedor con más texto
  let longestTextLength = 0;
  let bestElement = $("body");
  $("div, section").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > longestTextLength) {
      longestTextLength = text.length;
      bestElement = $(el);
    }
  });

  return bestElement.html() || $("body").html() || "";
}
