// Renders scripts/og.html to public/og.png (1200×630) with headless Chrome. Demo data only.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const page = fileURLToPath(new URL("./og.html", import.meta.url));
const out = fileURLToPath(new URL("../public/og.png", import.meta.url));
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--window-size=1200,630", `--screenshot=${out}`, `file://${page}`], { stdio: "inherit" });
console.log(`wrote ${out}`);
