import type * as cheerio from "cheerio";

type CheerioRoot = ReturnType<typeof cheerio.load>;

export interface StructuredProduct {
  name: string;
  url?: string;
  sku?: string;
  brand?: string;
  price?: string;
  lowPrice?: string;
  highPrice?: string;
  currency?: string;
  availability?: string;
}

const MAX_PRODUCTS = 100;

/**
 * Lee los bloques <script type="application/ld+json"> y devuelve los productos
 * (schema.org Product) con sus ofertas. Soporta arrays, @graph, ItemList y
 * offers como Offer, AggregateOffer o array. Ignora en silencio el JSON roto.
 */
export function extractStructuredProducts($: CheerioRoot): StructuredProduct[] {
  const products: StructuredProduct[] = [];
  const seen = new Set<string>();

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).text();
    const data = parseJsonLd(raw);
    if (data === undefined) return;

    for (const node of walk(data)) {
      if (products.length >= MAX_PRODUCTS) return;
      if (!hasType(node, "Product")) continue;

      const product = toProduct(node);
      if (!product) continue;

      const key = [product.name, product.price, product.lowPrice, product.url].join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      products.push(product);
    }
  });

  return products;
}

export function productsToMarkdown(products: StructuredProduct[]): string {
  if (products.length === 0) return "";

  const rows = products.map((p) => {
    const name = p.url
      ? `[${cell(p.name).replace(/[[\]]/g, "\\$&")}](${p.url.replace(/[()\s]/g, encodeURIComponent)})`
      : cell(p.name);
    return `| ${name} | ${cell(formatPrice(p))} | ${cell(p.availability ?? "")} |`;
  });

  return [
    "## Structured product data (JSON-LD)",
    "",
    "| Product | Price | Availability |",
    "|---|---|---|",
    ...rows,
  ].join("\n");
}

function parseJsonLd(raw: string): unknown {
  const text = raw.trim();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    // Algunos sitios meten saltos de línea o tabs crudos dentro de strings.
    try {
      return JSON.parse(text.replace(/[\u0000-\u001F]+/g, " "));
    } catch {
      return undefined;
    }
  }
}

/** Recorre el árbol JSON-LD y devuelve todos los objetos (incluye @graph e ItemList). */
function* walk(value: unknown, depth = 0): Generator<Record<string, any>> {
  if (depth > 8 || value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) yield* walk(item, depth + 1);
    return;
  }
  const obj = value as Record<string, any>;
  yield obj;
  for (const key of ["@graph", "itemListElement", "item", "mainEntity", "hasVariant"]) {
    if (key in obj) yield* walk(obj[key], depth + 1);
  }
}

function hasType(node: Record<string, any>, type: string): boolean {
  const t = node["@type"];
  if (Array.isArray(t)) return t.some((x) => typeof x === "string" && x.endsWith(type));
  return typeof t === "string" && t.endsWith(type);
}

function toProduct(node: Record<string, any>): StructuredProduct | null {
  const name = str(node.name);
  if (!name) return null;

  const product: StructuredProduct = {
    name,
    url: httpUrl(node.url),
    sku: str(node.sku),
    brand: str(typeof node.brand === "object" ? node.brand?.name : node.brand),
  };

  const offers = Array.isArray(node.offers) ? node.offers : node.offers ? [node.offers] : [];
  const offer = offers.find((o: any) => o && typeof o === "object");
  if (offer) {
    product.price = str(offer.price ?? offer.priceSpecification?.price);
    product.lowPrice = str(offer.lowPrice);
    product.highPrice = str(offer.highPrice);
    product.currency = str(offer.priceCurrency ?? offer.priceSpecification?.priceCurrency);
    product.availability = str(offer.availability)?.replace(/^https?:\/\/schema\.org\//i, "");
    product.url ??= httpUrl(offer.url);
  }

  return product;
}

function formatPrice(p: StructuredProduct): string {
  const cur = p.currency ? ` ${p.currency}` : "";
  if (p.price) return `${p.price}${cur}`;
  if (p.lowPrice && p.highPrice && p.lowPrice !== p.highPrice) return `${p.lowPrice}–${p.highPrice}${cur}`;
  if (p.lowPrice) return `${p.lowPrice}${cur}`;
  return "";
}

function str(v: unknown): string | undefined {
  if (typeof v === "number") return String(v);
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s || undefined;
}

function httpUrl(v: unknown): string | undefined {
  const s = str(v);
  return s && /^https?:\/\//i.test(s) ? s : undefined;
}

function cell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}
