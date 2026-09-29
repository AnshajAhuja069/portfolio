// Prints scripts/resume/resume.html to public/resume/anshaj-ahuja-resume.pdf
// using an installed Chromium-based browser (Microsoft Edge by default).
//   npm run resume
//   RESUME_BROWSER_CHANNEL=chrome npm run resume
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, "resume", "resume.html");
const outDir = path.join(root, "..", "public", "resume");
const out = path.join(outDir, "anshaj-ahuja-resume.pdf");

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: process.env.RESUME_BROWSER_CHANNEL ?? "msedge" });
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: "load" });
await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`Resume written to ${path.relative(process.cwd(), out)}`);
