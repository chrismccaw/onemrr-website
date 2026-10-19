// Full-page screenshots at 1440, 768 and 375 wide, via Lighthouse's full-page capture.
// Usage: node scripts/shots.mjs <url> <out-dir> <label>   (needs Chrome; Lighthouse via npx)
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
const [url, out, label] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const sizes = [
  { w: 1440, h: 900, form: "desktop", mobile: false },
  { w: 768, h: 1024, form: "mobile", mobile: true },
  { w: 375, h: 812, form: "mobile", mobile: true },
];
for (const s of sizes) {
  const json = join(out, `lh-${label}-${s.w}.json`);
  execFileSync("npx", ["-y", "lighthouse@12.6.1", url, "--quiet", "--only-categories=performance,accessibility",
    `--form-factor=${s.form}`, `--screenEmulation.mobile=${s.mobile}`, `--screenEmulation.width=${s.w}`, `--screenEmulation.height=${s.h}`,
    "--screenEmulation.deviceScaleFactor=1", "--throttling-method=provided", "--chrome-flags=--headless=new", "--output=json", `--output-path=${json}`],
    { stdio: "ignore", env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" } });
  const r = JSON.parse(readFileSync(json, "utf8"));
  const shot = r.fullPageScreenshot?.screenshot;
  if (shot) writeFileSync(join(out, `${label}-${s.w}.jpg`), Buffer.from(shot.data.split(",")[1], "base64"));
  const c = r.categories;
  console.log(`${label} ${s.w}px  perf ${Math.round(c.performance.score * 100)}  a11y ${Math.round(c.accessibility.score * 100)}  CLS ${r.audits["cumulative-layout-shift"].displayValue}  page ${shot?.height ?? "?"}px`);
  rmSync(json);
}
