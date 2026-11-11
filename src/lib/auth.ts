// Claves de acceso a /v1/. Viven en el secreto MD_KEYS del Worker, nunca en el repo:
//
//   npx wrangler secret put MD_KEYS
//
// con una clave por línea, cada una con el nombre de quien la usa:
//
//   damian = 3q2-7Hc...
//   claude = Zt9_xW1...
//
// Así se le puede quitar el acceso a una persona sin tocar a las demás. Las líneas vacías y las que
// empiezan con # se ignoran.

export type Keys = { name: string; hash: Uint8Array }[]

const encoder = new TextEncoder()

async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(text)))
}

export async function parseKeys(raw: string | undefined): Promise<Keys> {
  const keys: Keys = []
  for (const line of (raw ?? "").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq < 1) continue
    const name = t.slice(0, eq).trim()
    const key = t.slice(eq + 1).trim()
    // Una clave corta se adivina: se ignora.
    if (key.length < 24) continue
    keys.push({ name, hash: await sha256(key) })
  }
  return keys
}

// La clave del pedido: "Authorization: Bearer <clave>" o, para clientes que no ponen ese
// encabezado, "X-Api-Key: <clave>". Nunca en la URL, que queda en historiales y logs.
export function requestKey(request: Request): string | null {
  const auth = request.headers.get("Authorization")
  if (auth) {
    const m = /^Bearer\s+(.+)$/i.exec(auth.trim())
    if (m) return m[1].trim()
  }
  const x = request.headers.get("X-Api-Key")
  return x ? x.trim() : null
}

// Compara en tiempo constante, sobre los SHA-256, para que el tiempo de respuesta no deje adivinar
// la clave de a una letra.
function same(a: Uint8Array, b: Uint8Array): boolean {
  const subtle = crypto.subtle as SubtleCrypto & { timingSafeEqual?: (a: ArrayBufferView, b: ArrayBufferView) => boolean }
  if (subtle.timingSafeEqual) return subtle.timingSafeEqual(a, b)
  let diff = a.length ^ b.length
  for (let i = 0; i < Math.min(a.length, b.length); i++) diff |= a[i] ^ b[i]
  return diff === 0
}

// El nombre de quien manda la clave, o null si no hay clave o no es ninguna de las válidas.
export async function keyOwner(request: Request, keys: Keys): Promise<string | null> {
  const key = requestKey(request)
  if (!key) return null
  const h = await sha256(key)
  let owner: string | null = null
  // Se recorren todas, aunque una ya coincida, para que el tiempo no dependa de cuál es.
  for (const k of keys) if (same(h, k.hash) && owner === null) owner = k.name
  return owner
}
