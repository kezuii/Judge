#!/usr/bin/env node
// Regenerates app/data.js with the current submissions for a GCA contest post.
//
// Usage:
//   node scripts/fetch-submissions.mjs [postid]
//
// Defaults to GCA2026 ("Out of Frame") if no postid is given. Safe to re-run any
// time — e.g. to pick up last-minute submissions before judging finalizes.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const GCA2026_POSTID = "6a96a26d6a8d4b56ae94afb4";

const postid = process.argv[2] || GCA2026_POSTID;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "app", "data.js");

async function main() {
  const response = await fetch("https://artfol.club/api/v2/app/public/submissions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "postid": postid,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const submissions = await response.json();

  if (!Array.isArray(submissions)) {
    throw new Error(`Unexpected response shape: ${JSON.stringify(submissions).slice(0, 200)}`);
  }

  const urls = submissions.map(
    (submission) => `https://www.artfol-image.me/${submission.op}${submission.uri.split("&")[0]}`
  );

  const uniqueUrls = Array.from(new Set(urls));
  if (uniqueUrls.length !== urls.length) {
    console.warn(`Note: ${urls.length - uniqueUrls.length} duplicate URL(s) collapsed.`);
  }

  const body = uniqueUrls.map((url) => JSON.stringify(url)).join(",\n");
  const fileContents = `export const data = [\n${body}\n];\n`;

  await writeFile(outPath, fileContents, "utf8");

  console.log(`Wrote ${uniqueUrls.length} URLs to ${outPath} (postid: ${postid})`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
