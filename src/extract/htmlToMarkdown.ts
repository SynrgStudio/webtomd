import * as cheerio from "cheerio";
import html2md from "html-to-md";

export function htmlToCleanMarkdown(html: string): string {
  // Load HTML into Cheerio
  const $ = cheerio.load(html);

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
    "form",
    "[role='dialog']",
    "[role='banner']",
    "[role='navigation']",
    "[role='contentinfo']",
  ];
  $(noiseSelectors.join(",")).remove();

  // Determine main content area
  let content = $("article").html();
  
  if (!content) {
    content = $("main").html();
  }
  
  if (!content) {
    // Fallback: finding the container with the most text
    let longestTextLength = 0;
    let bestElement = $("body");

    // Revisamos divs o sections de nivel intermedio para buscar bloques de texto grandes
    $("div, section").each((_, el) => {
      // Ignoramos elementos vacíos o minúsculos
      const text = $(el).text().trim();
      if (text.length > longestTextLength) {
        longestTextLength = text.length;
        bestElement = $(el);
      }
    });

    content = bestElement.html();
  }

  // If even the fallback fails or we just fall back to body
  if (!content) {
    content = $("body").html() || "";
  }

  if (!content || !content.trim()) {
    return ""; // Empty string to indicate no content found
  }

  // Convert to Markdown
  const md = html2md(content);
  return md.trim();
}
