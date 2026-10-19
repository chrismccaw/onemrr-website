// Fails if any internal link in dist/ points to a missing page or a missing #anchor.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const root = "dist";
const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) walk(p);
  else if (p.endsWith(".html")) pages.push(p);
});
walk(root);

const route = (file) => "/" + relative(root, file).replace(/index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, "");
const ids = new Map(pages.map((f) => [route(f).replace(/\/$/, "") || "/", new Set([...readFileSync(f, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const fileFor = (path) => {
  const clean = path.replace(/\/$/, "") || "/";
  return clean === "/" ? join(root, "index.html") : [join(root, clean, "index.html"), join(root, `${clean}.html`), join(root, clean)].find((f) => existsSync(f));
};

let bad = 0;
for (const f of pages) {
  const from = route(f) || "/";
  for (const [, href] of readFileSync(f, "utf8").matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [path, hash] = href.split("#");
    const target = path === "" ? from : path;
    if (!fileFor(target)) { console.error(`${from}: broken link ${href}`); bad++; continue; }
    const key = target.replace(/\/$/, "") || "/";
    if (hash && ids.has(key) && !ids.get(key).has(hash)) { console.error(`${from}: missing anchor ${href}`); bad++; }
  }
}
console.log(bad ? `${bad} broken link(s)` : `links ok across ${pages.length} pages`);
process.exit(bad ? 1 : 0);
