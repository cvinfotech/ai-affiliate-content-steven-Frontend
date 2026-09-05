// Regenerate from the repository root: node scripts/documentation-index.mjs
// Static navigation aid only: no network, credentials, dependency install, or database access.
import {execFileSync} from 'node:child_process';
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const files = execFileSync('git', ['ls-files','-z'], {encoding:'utf8'}).split('\0').filter(Boolean).sort();
const code = files.filter(f => /\.(?:[cm]?[jt]sx?|sql|css|py|sh)$/.test(f) && !/(?:^|\/)(?:dist|build|node_modules|design-data)\//.test(f) && !f.startsWith('tmp-'));
const env = new Map(); const routes=[]; const tables=new Map(); const source=[];
for (const f of code) {
  const s=readFileSync(path.join(root,f),'utf8');
  source.push([f,s.split('\n').length]);
  for (const re of [/process\.env\.([A-Z][A-Z0-9_]*)/g,/process\.env\[['"]([A-Z][A-Z0-9_]*)['"]\]/g, /\b(?:env|num)\(['"]([A-Z][A-Z0-9_]*)['"]/g]) {
    for (const m of s.matchAll(re)) {const refs=env.get(m[1])??new Set();refs.add(f);env.set(m[1],refs);}
  }
  if (/(?:^|\/)(?:route|page)\.[jt]sx?$/.test(f)) {
    const app=f.match(/^(.*?)\bapp\/(.*)\/(route|page)\.[jt]sx?$/) ?? f.match(/^(.*?)\bapp\/()(route|page)\.[jt]sx?$/);
    if(app){const url='/'+app[2].split('/').filter(x=>x&&!/^\(.*\)$/.test(x)).join('/');const methods=[...s.matchAll(/export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b|export\s+const\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g)].map(m=>m[1]||m[2]); routes.push([app[1]+'app',url,app[3]==='page'?'page':methods.join(', ')||'inspect exports',f]);}
  }
  if(f.endsWith('.sql'))for(const m of s.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?([\w."-]+)/gi)){const refs=tables.get(m[1])??new Set();refs.add(f);tables.set(m[1],refs);}
}
const q=s=>'`'+s+'`';
const link=f=>'['+f+'](../'+encodeURI(f).replaceAll('(', '%28').replaceAll(')', '%29')+')';
let out='# Source reference\n\nGenerated with `node scripts/documentation-index.mjs`. Do not hand-edit.\n\nScope: Git-tracked source files, excluding build output, design reference corpora and root scratch scripts. This is a static index, not proof that a route is deployed, an environment variable is required, or a migration is applied. Computed environment keys, re-exported handlers and runtime tables require manual review. Comments may contribute matches. Secrets and environment values are never read.\n\n';
out+=`Scanned ${code.length} files; found ${routes.length} Next.js page/route files and ${env.size} literal environment names.\n\n`;
out+='## Route files\n\nApp root distinguishes independent applications in a monorepo. Bracket segments are dynamic Next.js parameters. SPA routes are in the frontend route registry, not this table.\n\n| App | Path | Kind / methods | Source |\n| --- | --- | --- | --- |\n'+routes.map(r=>'| '+r.slice(0,3).map(q).join(' | ')+' | '+link(r[3])+' |').join('\n')+'\n\n';
out+='## Environment name cross-reference\n\nA name appearing here does not mean it should be configured everywhere. Follow the application-specific setup guide and each read site. Public-prefixed values may be bundled into browser code. Never place a server secret in them.\n\n| Name | Read sites |\n| --- | --- |\n'+[...env].sort().map(([k,v])=>'| '+q(k)+' | '+[...v].map(link).join(', ')+' |').join('\n')+'\n\n';
out+='## SQL table declarations\n\nThese are declarations in source, not a live schema audit or a guaranteed migration order.\n\n| Table | SQL files |\n| --- | --- |\n'+[...tables].sort().map(([k,v])=>'| '+q(k)+' | '+[...v].map(link).join(', ')+' |').join('\n')+'\n\n';
out+='## Complete scanned-file index\n\n| File | Lines |\n| --- | ---: |\n'+source.map(([f,n])=>'| '+link(f)+' | '+n+' |').join('\n')+'\n';
mkdirSync('docs',{recursive:true});writeFileSync('docs/SOURCE_REFERENCE.md',out);
console.log(JSON.stringify({files:code.length,routes:routes.length,environmentNames:env.size,tables:tables.size}));
