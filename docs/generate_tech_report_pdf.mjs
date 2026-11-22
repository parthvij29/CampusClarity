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
const renderRow = (row, tag) => {
  const cells = row.split("|").slice(1, -1);
  return `<tr>${cells.map((cell) => `<${tag}>${escapeHtml(cell.trim())}</${tag}>`).join("")}</tr>`;
};
const content = source.trim().split(/\r?\n\r?\n/).map((block) => {
  if (block.startsWith("# ")) return `<h1>${escapeHtml(block.slice(2))}</h1>`;
  if (block.startsWith("## 4. ")) return `<h2 class="page-start">${escapeHtml(block.slice(3))}</h2>`;
  if (block.startsWith("## ")) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
  if (block.startsWith("| ")) {
    const [header, , ...rows] = block.split(/\r?\n/);
    return `<table><thead>${renderRow(header, "th")}</thead><tbody>${rows.map((row) => renderRow(row, "td")).join("")}</tbody></table>`;
  }
  const link = block.match(/^(Live prototype|Repository) \| (https:\/\/\S+)$/);
  if (link) return `<p>${link[1]} · <a href="${escapeHtml(link[2])}">${escapeHtml(link[2])}</a></p>`;
  return `<p>${escapeHtml(block)}</p>`;
}).join("\n");

const temp = mkdtempSync(join(tmpdir(), "campusclarity-report-"));
try {
  const html = join(temp, "report.html");
  writeFileSync(html, `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Campus Clarity Technical Report | PromptForge</title>
<style>
  @page {
    size: A4;
    margin: 19mm 18mm;
    @bottom-left { content: "PromptForge  /  PE-B25-34"; color: #475569; font: 9pt Arial; }
    @bottom-right { content: counter(page) " / " counter(pages); color: #475569; font: 9pt Arial; }
  }
  body { font: 12pt/1.5 Arial, sans-serif; color: #1e293b; margin: 0; }
  h1 { font-size: 25pt; color: #133f47; margin: 0 0 5pt; }
  h1 + p { color: #475569; border-bottom: 1pt solid #0f766e; padding-bottom: 8pt; }
  h2 { font-size: 15pt; color: #0f665e; margin: 15pt 0 5pt; break-after: avoid; }
  .page-start { break-before: page; }
  p { margin: 0 0 9pt; }
  table { border-collapse: collapse; font-size: 10.5pt; width: 100%; margin: 0 0 14pt; }
  th, td { padding: 6pt; border-bottom: 1pt solid #d8e5e3; text-align: left; vertical-align: top; }
  th { background: #e7f2ef; color: #133f47; }
  tr { break-inside: avoid; }
  td:first-child { white-space: nowrap; }
  a { color: #0f665e; }
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
