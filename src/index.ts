#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  const targetDir = args[0] || "my-app";

  // Ask JS or TS
  const { lang } = await prompts({
    type: "select",
    name: "lang",
    message: "Which language do you want?",
    choices: [
      { title: "JavaScript", value: "js" },
      { title: "TypeScript", value: "ts" }
    ],
    initial: 0
  });

  const templateName = lang;
  const src = path.join(__dirname, "..", "templates", templateName);
  const dest = path.resolve(process.cwd(), targetDir);

  // Create target folder
  fs.mkdirSync(dest, { recursive: true });

  // Copy files
  function copyDir(from: string, to: string) {
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      const srcPath = path.join(from, entry.name);
      const dstPath = path.join(to, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(dstPath, { recursive: true });
        copyDir(srcPath, dstPath);
      } else {
        fs.copyFileSync(srcPath, dstPath);
      }
    }
  }
  copyDir(src, dest);

  // Ask to install
  const { install } = await prompts({
    type: "confirm",
    name: "install",
    message: "Do you want to run npm install?",
    initial: true
  });

  if (install) {
    execSync("npm install", { cwd: dest, stdio: "inherit" });
  }

  console.log(`\nDone. Next steps:
  cd ${path.relative(process.cwd(), dest) || "."}
  ${install ? "" : "npm install\n  "}
  npm run dev
`);
}

main();
