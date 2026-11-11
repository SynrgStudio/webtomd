export function getLandingHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Proxy for LLMs - md.synrgs.tech</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              500: '#ffffff',
              600: '#e4e4e7',
              900: '#27272a',
            }
          }
        }
      }
    }
  </script>
  <style>
    details > summary { list-style: none; }
    details > summary::-webkit-details-marker { display: none; }
    details[open] summary ~ * {
      animation: slideDown 0.3s ease-in-out;
    }
    @keyframes slideDown {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    textarea::-webkit-scrollbar,
    pre::-webkit-scrollbar { width: 6px; }
    textarea::-webkit-scrollbar-track,
    pre::-webkit-scrollbar-track { background: #1a1a1a; }
    textarea::-webkit-scrollbar-thumb,
    pre::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-300 font-sans antialiased min-h-screen selection:bg-white selection:text-black">
  
  <!-- Main Container - 80% width -->
  <div class="w-[90%] lg:w-[80%] mx-auto px-4 py-8 md:py-12">
    
    <!-- Header -->
    <header class="flex items-center justify-between mb-10">
      <div class="text-xl font-bold tracking-tight text-white">
        md.synrgs.tech
      </div>
      <nav class="hidden sm:flex gap-6 text-sm text-zinc-400 font-medium">
        <a href="#how-it-works" class="hover:text-white transition-colors">How it works</a>
        <a href="#benefits" class="hover:text-white transition-colors">Benefits</a>
        <a href="#faq" class="hover:text-white transition-colors">FAQ</a>
      </nav>
    </header>

    <!-- Hero Section - Two Columns -->
    <section class="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16 py-8 lg:py-12 items-center">
      
      <!-- Left Column: Hero Content -->
      <div class="flex flex-col justify-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Nothing screams efficiency<br class="hidden md:block"> like pure Markdown.
        </h1>
        <p class="text-base md:text-lg text-zinc-400 mb-8">
          Convert any URL into a clean, optimized input for your LLM. 
          Simply prepend <code class="bg-zinc-900 border border-zinc-800 px-2 py-1 text-white font-mono text-sm mx-1">md.synrgs.tech/v1/</code> to your link.
        </p>
        <p class="text-sm text-zinc-500 -mt-4 mb-8">
          This instance is private: every request needs an access key, sent as <code class="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-zinc-300 font-mono text-xs">Authorization: Bearer &lt;key&gt;</code>.
          The code is open source, so you can run your own.
        </p>
        
        <!-- Stats -->
        <div class="flex gap-10 pt-6 border-t border-zinc-800">
          <div>
            <p class="text-2xl font-bold text-white">99%</p>
            <p class="text-xs text-zinc-500">Token savings</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">10ms</p>
            <p class="text-xs text-zinc-500">Avg response</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">Free</p>
            <p class="text-xs text-zinc-500">Open source</p>
          </div>
        </div>
      </div>

      <!-- Right Column: URL Generator + Demo -->
      <div class="space-y-6">
        <!-- URL Generator -->
        <div class="bg-zinc-900/50 p-5 border border-zinc-800">
          <label class="block mb-3">
            <span class="text-xs text-zinc-500">Access key · kept in this browser only</span>
            <input
              type="password"
              id="access-key"
              autocomplete="off"
              spellcheck="false"
              placeholder="Paste your key"
              class="mt-1 w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 block p-3 outline-none placeholder-zinc-600"
            >
          </label>
          <form id="proxy-form" class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              </div>
              <input 
                type="url" 
                id="target-url" 
                placeholder="https://example.com/article" 
                pattern="https?://.*" 
                title="Must be a valid URL starting with http:// or https://" 
                required
                class="w-full bg-zinc-950 border border-zinc-800 text-white text-sm focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 block pl-11 p-3 transition-all outline-none placeholder-zinc-600"
              >
            </div>
            <button type="submit" class="bg-zinc-200 hover:bg-white text-black font-semibold py-3 px-5 transition-colors whitespace-nowrap flex items-center justify-center gap-2 text-sm">
              Generate Link
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>
          
          <div id="error-msg" class="text-red-400 text-sm mt-3 font-medium hidden"></div>
          <div id="fetch-result" class="mt-4 hidden">
            <div class="flex items-center justify-between gap-3 mb-2">
              <span id="fetch-status" class="text-xs text-zinc-500 font-mono"></span>
              <button id="fetch-copy" type="button" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 text-xs font-medium transition-colors">Copy Markdown</button>
            </div>
            <pre id="fetch-output" class="bg-zinc-950 border border-zinc-800 p-3 max-h-96 overflow-auto text-xs text-zinc-300 font-mono whitespace-pre-wrap"></pre>
          </div>
          
          <!-- Result Area -->
          <div id="result-container" class="mt-4 hidden">
            <div class="bg-zinc-900 border border-zinc-700 p-3 flex items-center justify-between gap-3">
              <code id="proxy-link" class="text-white font-mono text-xs break-all flex-1 select-all"></code>
              <button id="fetch-btn" type="button" class="shrink-0 bg-zinc-200 hover:bg-white text-black px-3 py-1.5 text-xs font-semibold transition-colors">Fetch here</button>
              <button id="copy-btn" class="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <span id="copy-text">Copy</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Live Demo Panels -->
        <div class="flex flex-col md:flex-row gap-4 items-stretch relative">
          <!-- Input Panel (HTML) -->
          <div class="flex-1 bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div class="flex items-center gap-4 px-4 py-2 border-b border-zinc-800 bg-zinc-900/80">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
              </div>
              <span class="text-xs text-zinc-500 font-mono">raw_source.html</span>
              <span class="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 border border-red-500/20 font-mono ml-auto">~1,452 tokens</span>
            </div>
            <div class="p-3">
              <pre class="w-full h-32 bg-transparent text-[10px] font-mono text-zinc-500 overflow-auto leading-tight opacity-60">
&lt;!-- Typical bloated header --&gt;
&lt;header class="nav-6_component"&gt;
  &lt;div class="nav-6_container"&gt;
    &lt;div class="nav-6_menu-button w-nav-button"&gt;
      &lt;div class="nav-6_menu-icon"&gt;
        &lt;div class="menu-icon_line-top"&gt;&lt;/div&gt;
        &lt;div class="menu-icon_line-middle"&gt;&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;script src="https://analytics.io/track.js"&gt;&lt;/script&gt;
    &lt;style&gt;.nav-6 { display: flex; font-size: 1.2rem; }&lt;/style&gt;
  &lt;/div&gt;
&lt;/header&gt;
&lt;main class="section-hero"&gt;
  &lt;h1&gt;The Future of AI&lt;/h1&gt;
  &lt;p&gt;Artificial Intelligence is evolving rapidly...&lt;/p&gt;
  &lt;p&gt;It is predicted that by 2030...&lt;/p&gt;
&lt;/main&gt;</pre>
            </div>
          </div>

          <!-- Connection Arrow Decorator (Desktop Horizontal) -->
          <div class="hidden md:flex flex-col items-center justify-center gap-1 self-center z-20 px-1 shrink-0">
            <div class="bg-red-500/20 h-px w-6"></div>
            <div class="bg-zinc-950 border border-zinc-700 px-1.5 py-1 rounded-sm text-[9px] font-black text-white whitespace-nowrap shadow-xl border-dashed">
              -96.7%
            </div>
            <div class="flex items-center">
              <div class="bg-gradient-to-r from-red-500/50 to-emerald-500/50 h-px w-6"></div>
              <div class="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-emerald-500/50"></div>
            </div>
          </div>

          <!-- Output Panel (Markdown) -->
          <div class="flex-1 bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div class="flex items-center gap-4 px-4 py-2 border-b border-zinc-800 bg-zinc-900/80">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/30"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
              </div>
              <span class="text-xs text-zinc-500 font-mono">optimized.md</span>
              <span class="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 border border-emerald-500/20 font-mono ml-auto">~48 tokens</span>
            </div>
            <div class="p-3 relative group">
              <pre id="textOutput" class="w-full h-32 bg-transparent text-xs font-mono text-emerald-400 overflow-auto leading-relaxed">
# The Future of AI

Artificial Intelligence is evolving rapidly...
It is predicted that by 2030, AI will contribute $15.7 trillion to the global economy. 
Key sectors include healthcare, finance, and autonomous transport.</pre>
            </div>
          </div>
        </div>
        <p class="text-[10px] text-zinc-600 text-center uppercase tracking-[0.2em] pt-4">Instant context optimization</p>
      </div>
    </section>

    <hr class="border-zinc-800 my-16">

    <!-- Benefits Section -->
    <section id="benefits" class="mb-20">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Real-world impact</h2>
      <p class="text-center text-zinc-400 mb-10 max-w-3xl mx-auto">We ran our extraction against some of the heaviest pages on the internet. The difference in context window usage is massive.</p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
        <!-- Example 1: CNN -->
        <div class="bg-zinc-900 border border-zinc-800 p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-bold text-white">CNN Homepage</h3>
            <div class="bg-white text-black text-xs font-bold px-2 py-1">99% SAVINGS</div>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Raw HTML Tokens</p>
              <div class="text-xl font-mono text-zinc-400 line-through decoration-red-500">1,381,059</div>
            </div>
            <div>
              <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Clean Markdown Tokens</p>
              <div class="text-2xl font-mono text-white font-bold">13,652</div>
            </div>
          </div>
        </div>

        <!-- Example 2: TechCrunch -->
        <div class="bg-zinc-900 border border-zinc-800 p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-bold text-white">TechCrunch Homepage</h3>
            <div class="bg-white text-black text-xs font-bold px-2 py-1">92% SAVINGS</div>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Raw HTML Tokens</p>
              <div class="text-xl font-mono text-zinc-400 line-through decoration-red-500">134,747</div>
            </div>
            <div>
              <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Clean Markdown Tokens</p>
              <div class="text-2xl font-mono text-white font-bold">10,575</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-zinc-900/40 border border-zinc-800 p-6 text-center max-w-3xl mx-auto">
        <p class="text-sm text-zinc-400 leading-relaxed">LLMs have limited context windows and charge per token. Bypassing ads, inline CSS, heavy SVG icons, tracking scripts, and deep nested divs drastically reduces cost, avoids hallucinations, and speeds up response times.</p>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="mb-20 max-w-[90rem] mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-8 text-center">How it works</h2>
      
      <div class="grid xl:grid-cols-3 gap-6 mb-10">
        <div class="bg-zinc-900 border border-zinc-800 p-6 w-full">
          <div class="w-10 h-10 bg-white/10 flex items-center justify-center mb-4 text-white font-bold">1</div>
          <h3 class="font-semibold text-white mb-3 text-lg">Paste any URL</h3>
          <p class="text-zinc-400 text-sm whitespace-nowrap">Enter any webpage URL containing content you want to extract.</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-6 w-full">
          <div class="w-10 h-10 bg-white/10 flex items-center justify-center mb-4 text-white font-bold">2</div>
          <h3 class="font-semibold text-white mb-3 text-lg">We clean it</h3>
          <p class="text-zinc-400 text-sm whitespace-nowrap">Our API fetches the page and extracts clean Markdown content.</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-6 w-full">
          <div class="w-10 h-10 bg-white/10 flex items-center justify-center mb-4 text-white font-bold">3</div>
          <h3 class="font-semibold text-white mb-3 text-lg">Use with LLMs</h3>
          <p class="text-zinc-400 text-sm whitespace-nowrap">Feed the optimized output directly to your favorite AI model.</p>
        </div>
      </div>

      <!-- API Example -->
      <div class="bg-zinc-900 border border-zinc-800 overflow-hidden max-w-2xl mx-auto">
        <div class="flex items-center gap-4 px-4 py-2 border-b border-zinc-800">
          <span class="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-medium">GET</span>
          <span class="text-xs text-zinc-500 font-mono">Example Request</span>
        </div>
        <div class="p-4 overflow-x-auto">
          <code class="text-sm font-mono text-zinc-300 whitespace-nowrap">curl -i -H "Authorization: Bearer $MD_KEY" https://md.synrgs.tech/v1/https://wikipedia.org/wiki/API</code>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="max-w-3xl mx-auto mb-20">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
      
      <div class="space-y-4">
        <details class="group bg-zinc-900 border border-zinc-800 overflow-hidden">
          <summary class="flex items-center justify-between cursor-pointer p-4 font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors select-none">
            How do I use this in my code or AI Agent?
            <svg class="w-5 h-5 text-zinc-500 group-open:-rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </summary>
          <div class="p-4 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 mt-2">
            <p class="mt-2">Make a GET request by prepending the API to your target URL, with your access key in the <code class="bg-zinc-800 px-1">Authorization</code> header. Without a valid key the answer is <code class="bg-zinc-800 px-1">401</code>.</p>
            <pre class="bg-zinc-950 p-3 border border-zinc-800 mt-3 overflow-x-auto"><code class="text-white font-mono text-xs">curl -i -H "Authorization: Bearer $MD_KEY" https://md.synrgs.tech/v1/https://wikipedia.org/wiki/API</code></pre>
            <p class="mt-3">The server will return the response with the <code class="bg-zinc-800 px-1">Content-Type: text/markdown</code> header.</p>
          </div>
        </details>

        <details class="group bg-zinc-900 border border-zinc-800 overflow-hidden">
          <summary class="flex items-center justify-between cursor-pointer p-4 font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors select-none">
            Can the proxy execute JavaScript or bypass Paywalls?
            <svg class="w-5 h-5 text-zinc-500 group-open:-rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </summary>
          <div class="p-4 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 mt-2">
            <p class="mt-2"><strong class="text-white">No.</strong> Our server acts as a "static read-only" agent for maximum security and speed.</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>It does not execute target page JavaScript.</li>
              <li>It automatically removes any <code class="bg-zinc-800 px-1">&lt;script&gt;</code> tag to prevent malicious code injection.</li>
              <li>If a page is a pure Single Page Application (SPA) without Server-Side Rendering, the proxy will return a Markdown warning.</li>
            </ul>
          </div>
        </details>

        <details class="group bg-zinc-900 border border-zinc-800 overflow-hidden">
          <summary class="flex items-center justify-between cursor-pointer p-4 font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors select-none">
            What happens if the URL is invalid or private?
            <svg class="w-5 h-5 text-zinc-500 group-open:-rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </summary>
          <div class="p-4 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 mt-2">
            <p class="mt-2">The proxy has built-in Anti-SSRF (Server-Side Request Forgery) measures. It will immediately block requests to:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Localhost (127.0.0.1)</li>
              <li>Private networks (e.g., 192.168.x.x, 10.x.x.x)</li>
              <li>Non-HTTP schemas (e.g., ftp://, file://)</li>
            </ul>
            <p class="mt-2">In these cases, you will receive a clear error message formatted in Markdown.</p>
          </div>
        </details>
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-center text-zinc-500 text-sm pt-12 pb-4 border-t border-zinc-800">
      <p>Built to save tokens and time. &copy; 2026 synrgs.tech</p>
    </footer>
  </div>

  <script>
    // URL Generator
    document.getElementById('proxy-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const targetUrl = document.getElementById('target-url').value.trim();
      const errorDiv = document.getElementById('error-msg');
      const resultDiv = document.getElementById('result-container');
      
      errorDiv.classList.add('hidden');
      resultDiv.classList.add('hidden');

      if (!targetUrl) return;

      try {
        const url = new URL(targetUrl);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          throw new Error('Only http:// or https:// URLs are allowed.');
        }
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.startsWith('192.168.') || url.hostname.startsWith('10.')) {
          throw new Error('Local or private URLs are not allowed.');
        }
      } catch (err) {
        errorDiv.textContent = err.message || 'Please enter a valid full URL (e.g., https://wikipedia.org).';
        errorDiv.classList.remove('hidden');
        return;
      }

      const baseUrl = window.location.origin + '/v1/';
      const proxyUrl = baseUrl + targetUrl;
      document.getElementById('proxy-link').textContent = proxyUrl;
      resultDiv.classList.remove('hidden');
      
      // Smooth scroll to result
      setTimeout(() => {
          resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });

    // La clave queda solo en este navegador (localStorage) y viaja en el encabezado, nunca en la URL.
    const keyInput = document.getElementById('access-key');
    try { keyInput.value = localStorage.getItem('mdKey') || ''; } catch (e) {}
    keyInput.addEventListener('input', function() {
      try { localStorage.setItem('mdKey', keyInput.value.trim()); } catch (e) {}
    });

    document.getElementById('fetch-btn').addEventListener('click', async function() {
      const link = document.getElementById('proxy-link').textContent;
      const key = keyInput.value.trim();
      const box = document.getElementById('fetch-result');
      const status = document.getElementById('fetch-status');
      const out = document.getElementById('fetch-output');
      box.classList.remove('hidden');
      if (!key) {
        status.textContent = 'Paste your access key first.';
        out.textContent = '';
        return;
      }
      status.textContent = 'Fetching…';
      out.textContent = '';
      try {
        const res = await fetch(link, { headers: { Authorization: 'Bearer ' + key } });
        const text = await res.text();
        status.textContent = res.status === 401 ? 'That key is not valid.' : 'HTTP ' + res.status + ' · ' + text.length + ' characters';
        out.textContent = text;
      } catch (err) {
        status.textContent = 'Could not reach the proxy.';
      }
    });

    document.getElementById('fetch-copy').addEventListener('click', function() {
      navigator.clipboard.writeText(document.getElementById('fetch-output').textContent);
      this.textContent = 'Copied!';
      setTimeout(() => { this.textContent = 'Copy Markdown'; }, 1500);
    });

    document.getElementById('copy-btn').addEventListener('click', function() {
      const linkText = document.getElementById('proxy-link').textContent;
      navigator.clipboard.writeText(linkText).then(() => {
        const textSpan = document.getElementById('copy-text');
        textSpan.textContent = 'Copied!';
        this.classList.add('bg-white', 'text-black');
        this.classList.remove('bg-zinc-800', 'text-zinc-300');
        setTimeout(() => {
          textSpan.textContent = 'Copy';
          this.classList.remove('bg-white', 'text-black');
          this.classList.add('bg-zinc-800', 'text-zinc-300');
        }, 2000);
      });
    });

    document.getElementById('copyOutputBtn').addEventListener('click', function() {
      const textOutput = document.getElementById('textOutput');
      navigator.clipboard.writeText(textOutput.textContent).then(() => {
        this.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Copied!';
        setTimeout(() => {
          this.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy';
        }, 2000);
      });
    });
  </script>
</body>
</html>
`;
}
