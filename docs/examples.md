# Ejemplos de Uso

El servicio actúa como un proxy inverso. Dada cualquier URL pública, el servicio procesa el HTML y devuelve el contenido principal en formato Markdown.

## 1. Usando el frontend web
Ingresa a la raíz del sitio (ej. `https://markdown-proxy.tu-dominio.workers.dev/`).
Verás una interfaz simple donde puedes pegar la URL que deseas convertir. Al hacer clic en el botón, se generará la URL de proxy que puedes copiar.

## 2. Acceso Directo por API
Simplemente prependé la URL de tu servicio a la URL objetivo usando el path `/v1/`.

**Formato:**
`GET /v1/{url-destino}`

**Ejemplo de Petición (cURL):**
```bash
curl -i https://markdown-proxy.tu-dominio.workers.dev/v1/https://es.wikipedia.org/wiki/Markdown
```

**Respuesta Esperada:**
```http
HTTP/1.1 200 OK
Content-Type: text/markdown; charset=utf-8
Cache-Control: public, max-age=3600

# Markdown

**Markdown** es un lenguaje de marcado ligero...
(contenido convertido a Markdown limpio)
```

## 3. Manejo de Errores
Si la URL destino es inválida, privada (localhost), o el servidor destino falla, recibirás un mensaje de error claro en formato Markdown.

**Ejemplo (URL privada):**
```bash
curl -i https://markdown-proxy.tu-dominio.workers.dev/v1/https://localhost/admin
```

**Respuesta (400 Bad Request):**
```http
HTTP/1.1 400 Bad Request
Content-Type: text/markdown; charset=utf-8

# Error: URL Inválida o Bloqueada

La URL proporcionada no es válida o pertenece a un rango de red no permitido (ej. localhost/red privada).
```
