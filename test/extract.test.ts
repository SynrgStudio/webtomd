import { describe, it, expect } from "vitest";
import { htmlToCleanMarkdown } from "../src/extract/htmlToMarkdown";

describe("htmlToCleanMarkdown", () => {
  it("extracts article content and ignores nav/footer", () => {
    const html = `
      <html>
        <body>
          <nav>Menu</nav>
          <article>
            <h1>Título principal</h1>
            <p>Contenido del artículo.</p>
          </article>
          <footer>Copyright</footer>
        </body>
      </html>
    `;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("# Título principal");
    expect(md).toContain("Contenido del artículo.");
    expect(md).not.toContain("Menu");
    expect(md).not.toContain("Copyright");
  });

  it("fallbacks to main if article is not present", () => {
    const html = `
      <html>
        <body>
          <main>
            <h2>Contenido en main</h2>
          </main>
        </body>
      </html>
    `;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("## Contenido en main");
  });

  it("removes scripts and styles", () => {
    const html = `
      <article>
        <style>.rojo { color: red; }</style>
        <p>Texto útil</p>
        <script>alert('hola');</script>
      </article>
    `;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("Texto útil");
    expect(md).not.toContain(".rojo");
    expect(md).not.toContain("alert");
  });
});
