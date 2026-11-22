import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const browser = process.argv[2];
if (!browser) {
  throw new Error("Pass the path to a Chromium browser executable.");
}

const source = readFileSync(new URL("Technical_Report.md", import.meta.url), "utf8");
const output = fileURLToPath(new URL("../PromptForge_TchnicalReport.pdf", import.meta.url));
const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const content = source.trim().split(/\r?\n\r?\n/).map((block) => {
  if (block.startsWith("# ")) return `<h1>${escapeHtml(block.slice(2))}</h1>`;
  if (block.startsWith("## ")) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
  return `<p>${escapeHtml(block)}</p>`;
}).join("\n");

const temp = mkdtempSync(join(tmpdir(), "campusclarity-report-"));
try {
  const html = join(temp, "report.html");
  writeFileSync(html, `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>CampusClarity Technical Report | PromptForge</title>
<style>
  @page { size: A4; margin: 15mm 18mm; }
  body { font: 10.5pt/1.36 Arial, sans-serif; color: #1e293b; margin: 0; }
  h1 { font-size: 25pt; color: #133f47; margin: 0 0 5pt; }
  h1 + p { color: #475569; border-bottom: 1pt solid #0f766e; padding-bottom: 8pt; }
  h2 { font-size: 12.5pt; color: #0f665e; margin: 11pt 0 4pt; break-after: avoid; }
  p { margin: 0 0 6pt; }
</style>
<main>${content}</main>
</html>`);
  execFileSync(browser, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--user-data-dir=${join(temp, "profile")}`,
    `--print-to-pdf=${output}`,
    pathToFileURL(html).href,
  ], { stdio: "inherit" });
  const pdf = readFileSync(output);
  if (!pdf.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    throw new Error("The browser did not generate a valid PDF header.");
  }
} finally {
  rmSync(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
