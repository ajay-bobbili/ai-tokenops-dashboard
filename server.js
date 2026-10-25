// Claude Usage Dashboard - local server. Reads Claude Code transcripts (~/.claude/projects/**/*.jsonl)
// Run: node server.js   ->  http://localhost:4317
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), readline = require('readline');
const PORT = process.env.PORT || 4317;
const ROOT = process.env.CLAUDE_PROJECTS || path.join(os.homedir(), '.claude', 'projects');

const HEAVY = new Set(['Edit', 'Write', 'NotebookEdit', 'MultiEdit', 'Agent', 'Task']);
const cache = new Map(); // file -> {mtime,size,recs}

function walk(dir, out = []) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.jsonl')) out.push(p);
  }
  return out;
}

async function parseFile(file) {
  const st = fs.statSync(file);
  const c = cache.get(file);
  if (c && c.mtime === st.mtimeMs && c.size === st.size) return c.recs;
  const byId = new Map();
  const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes('"usage"')) continue;
    let j; try { j = JSON.parse(line); } catch { continue; }
    const m = j.message; if (!m || !m.usage || !m.model || m.model.startsWith('<')) continue;
    const u = m.usage;
    const tools = [], thinking = Array.isArray(m.content) && m.content.some(b => b.type === 'thinking');
    if (Array.isArray(m.content)) for (const b of m.content) if (b.type === 'tool_use') tools.push(b.name);
    const key = (m.id || j.uuid) + '|' + (j.requestId || '');
    const prev = byId.get(key);
    byId.set(key, { // later chunks of a streamed message carry final usage + more tool blocks
      t: Date.parse(j.timestamp), model: m.model,
      i: u.input_tokens || 0, o: u.output_tokens || 0, cr: u.cache_read_input_tokens || 0, cw: u.cache_creation_input_tokens || 0,
      p: path.basename((j.cwd || '').replace(/\\/g, '/')) || 'unknown', s: j.sessionId || path.basename(file, '.jsonl'),
      tools: prev ? [...new Set([...prev.tools, ...tools])] : tools, th: thinking || (prev && prev.th) || false,
      sc: !!j.isSidechain,
    });
  }
  const recs = [...byId.values()].filter(r => r.t);
  cache.set(file, { mtime: st.mtimeMs, size: st.size, recs });
  return recs;
}

async function load() {
  const files = walk(ROOT), all = [];
  for (const f of files) { try { all.push(...await parseFile(f)); } catch (e) { console.error('skip', f, e.message); } }
  all.sort((a, b) => a.t - b.t);
  return { files: files.length, root: ROOT, heavy: [...HEAVY], records: all };
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/data')) {
      const d = await load();
      res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(d));
    }
    const f = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const p = path.join(__dirname, 'public', path.normalize(f).replace(/^(\.\.[\\/])+/, ''));
    if (!p.startsWith(path.join(__dirname, 'public'))) { res.writeHead(403); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'text/plain' }); fs.createReadStream(p).on('error', () => res.end()).pipe(res);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(PORT, '127.0.0.1', () => console.log(`Claude Usage Dashboard -> http://localhost:${PORT}  (reading ${ROOT})`));
