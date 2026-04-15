export function getErrorMarkdown(title: string, message: string): string {
  return `# Error: ${title}\n\n${message}`;
}

export function createErrorResponse(title: string, message: string, status: number = 400): Response {
  return new Response(getErrorMarkdown(title, message), {
    status,
    headers: { "Content-Type": "text/markdown; charset=utf-8" }
  });
}
