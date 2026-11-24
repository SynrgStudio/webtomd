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
  it("makes relative links and images whole when it knows the page's address", () => {
    const html = `<main><p><a href="/profile/x">Perfil</a> <a href="#top">Arriba</a> <img src="img/a.png" alt="A"></p></main>`;
    const md = htmlToCleanMarkdown(html, "https://example.com/blog/post");
    expect(md).toContain("(https://example.com/profile/x)");
    expect(md).toContain("(#top)");
    expect(md).toContain("(https://example.com/blog/img/a.png)");
  });

  it("keeps a button's words but not its tag, and drops link and template tags", () => {
    const html = `<main><link rel="x"><template><p>oculto</p></template><p>Remera</p><button>Agregar <b>al carrito</b></button></main>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("Agregar al carrito");
    expect(md).not.toContain("<button");
    expect(md).not.toContain("<link");
    expect(md).not.toContain("oculto");
  });
});
