import { describe, it, expect } from "vitest";
import { htmlToCleanMarkdown } from "../src/extract/htmlToMarkdown";

describe("páginas de e-commerce", () => {
  it("conserva todos los productos de una grilla con varias <article>", () => {
    const html = `
      <html><body><main>
        <h1>Máquinas</h1>
        <article class="card"><h2>SodaStream Terra</h2><span class="price">$106.751</span></article>
        <article class="card"><h2>SodaStream Art</h2><span class="price">$126.879</span></article>
        <article class="card"><h2>Cilindro 60L</h2><span class="price">$45.799</span></article>
      </main></body></html>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("# Máquinas");
    for (const s of ["SodaStream Terra", "$106.751", "SodaStream Art", "$126.879", "Cilindro 60L", "$45.799"]) {
      expect(md).toContain(s);
    }
    // cada producto en su propio bloque, no pegado al siguiente
    expect(md).toMatch(/\$106\.751\n\n## SodaStream Art/);
  });

  it("concatena varias <article> aunque no haya <main>", () => {
    const html = `
      <body>
        <article><h2>Post A</h2><p>Texto A</p></article>
        <article><h2>Post B</h2><p>Texto B</p></article>
      </body>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("Post A");
    expect(md).toContain("Post B");
  });

  it("no duplica <article> anidadas", () => {
    const html = `
      <body>
        <article><h2>Externa</h2><article><p>Interna única</p></article></article>
        <article><h2>Otra</h2></article>
      </body>`;
    const md = htmlToCleanMarkdown(html);
    expect(md.match(/Interna única/g)).toHaveLength(1);
  });

  it("conserva el producto dentro de un <form> de agregar al carrito", () => {
    const html = `
      <html><body><main>
        <h1>Producto</h1>
        <form action="/cart/add">
          <h2>SodaStream Gaia</h2>
          <span class="price">$99.999</span>
          <input type="hidden" name="id" value="123">
          <button>Comprar</button>
        </form>
      </main></body></html>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("SodaStream Gaia");
    expect(md).toContain("$99.999");
    expect(md).not.toContain("123");
  });

  it("sigue sacando forms de búsqueda, newsletter y login", () => {
    const html = `
      <main>
        <p>Contenido real</p>
        <form role="search"><label>Buscar productos</label></form>
        <form><label>Suscribite al newsletter</label><input type="email"></form>
        <form><label>Ingresá a tu cuenta</label><input type="password"></form>
      </main>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("Contenido real");
    expect(md).not.toContain("Buscar productos");
    expect(md).not.toContain("newsletter");
    expect(md).not.toContain("Ingresá a tu cuenta");
  });
});

describe("JSON-LD de productos", () => {
  it("extrae un Product con Offer antes de borrar los scripts", () => {
    const html = `
      <html><head>
        <script type="application/ld+json">
          {"@context":"https://schema.org","@type":"Product","name":"SodaStream Terra",
           "url":"https://tienda.example/terra",
           "offers":{"@type":"Offer","price":"106751","priceCurrency":"ARS","availability":"https://schema.org/InStock"}}
        </script>
      </head><body><main><h1>Terra</h1></main></body></html>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("## Structured product data (JSON-LD)");
    expect(md).toContain("[SodaStream Terra](https://tienda.example/terra)");
    expect(md).toContain("106751 ARS");
    expect(md).toContain("InStock");
    expect(md).toContain("# Terra");
    expect(md).not.toContain("schema.org");
  });

  it("soporta @graph, ItemList, AggregateOffer y @type como array", () => {
    const html = `
      <script type="application/ld+json">
        {"@graph":[
          {"@type":"WebPage","name":"No soy producto"},
          {"@type":"ItemList","itemListElement":[
            {"@type":"ListItem","position":1,"item":{"@type":["Product"],"name":"Cilindro 60L",
              "offers":{"@type":"AggregateOffer","lowPrice":13199,"highPrice":14999,"priceCurrency":"ARS"}}},
            {"@type":"ListItem","position":2,"item":{"@type":"Product","name":"Botella 1L",
              "offers":[{"@type":"Offer","price":16949,"priceCurrency":"ARS"}]}}
          ]}
        ]}
      </script>
      <main><p>Listado</p></main>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("Cilindro 60L");
    expect(md).toContain("13199–14999 ARS");
    expect(md).toContain("Botella 1L");
    expect(md).toContain("16949 ARS");
    expect(md).not.toContain("No soy producto");
  });

  it("ignora JSON-LD roto sin romper la conversión", () => {
    const html = `
      <script type="application/ld+json">{ "@type": "Product", "name": </script>
      <main><p>Sigue funcionando</p></main>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("Sigue funcionando");
    expect(md).not.toContain("Structured product data");
  });

  it("devuelve los datos estructurados aunque el body esté vacío (SPA con JSON-LD)", () => {
    const html = `
      <script type="application/ld+json">{"@type":"Product","name":"Art","offers":{"price":"126879","priceCurrency":"ARS"}}</script>
      <body><div id="root"></div></body>`;
    const md = htmlToCleanMarkdown(html);
    expect(md).toContain("Art");
    expect(md).toContain("126879 ARS");
  });

  it("escapa pipes en los nombres para no romper la tabla", () => {
    const html = `<script type="application/ld+json">{"@type":"Product","name":"Pack | x2","offers":{"price":"1"}}</script><main><p>x</p></main>`;
    expect(htmlToCleanMarkdown(html)).toContain("Pack \\| x2");
  });
});
