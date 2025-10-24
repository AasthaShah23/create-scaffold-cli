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
  let targetDir = args[0];

  // 🟢 Ask for project name if not provided
  if (!targetDir) {
    const { projectName } = await prompts({
      type: "text",
      name: "projectName",
      message: "What is your project name?",
      initial: "my-ts-app",
    });
    targetDir = projectName.trim() || "my-ts-app";
  }

  // 🟢 Ask for type: Frontend or Backend
  const { projectType } = await prompts({
    type: "select",
    name: "projectType",
    message: "What kind of project do you want to scaffold?",
    choices: [
      { title: "Frontend (React + Vite)", value: "frontend" },
      { title: "Backend (Express, Node.)", value: "backend" },
    ],
  });

  let dbType = "none";
  if (projectType === "backend") {
    const { dbChoice } = await prompts({
      type: "select",
      name: "dbChoice",
      message: "Select the type of database setup:",
      choices: [
        { title: "SQL (PostgreSQL, MySQL, etc.)", value: "sql" },
        { title: "NoSQL (MongoDB, etc.)", value: "nosql" },
      ],
    });
    dbType = dbChoice;
  }
  // Path to template
  const templateName =  projectType === "backend" ? path.join("backend", dbType) : "frontend";
  const src = path.join(__dirname, "..", "templates", templateName);
  const dest = path.resolve(process.cwd(), targetDir);

  // 🟢 Create target folder
  fs.mkdirSync(dest, { recursive: true });

  // 🟢 Copy template files recursively
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

  // 🟢 Detect package manager (npm, yarn, pnpm)
  function getPkgManager(): "npm" | "yarn" | "pnpm" {
    const userAgent = process.env.npm_config_user_agent || "";
    if (userAgent.startsWith("yarn")) return "yarn";
    if (userAgent.startsWith("pnpm")) return "pnpm";
    return "npm";
  }
  const pkgManager = getPkgManager();

  // 🟢 Ask to install & start
  const { installNow } = await prompts({
    type: "confirm",
    name: "installNow",
    message: `Install dependencies with ${pkgManager} and start now?`,
    initial: true,
  });

  if (installNow) {
    execSync(`${pkgManager} install`, { cwd: dest, stdio: "inherit" });

    // Try to run dev/start automatically
    try {
      execSync(`${pkgManager} run dev`, { cwd: dest, stdio: "inherit" });
    } catch {
      try {
        execSync(`${pkgManager} start`, { cwd: dest, stdio: "inherit" });
      } catch {
        console.log("\n⚠️  No start or dev script found in package.json.");
      }
    }
  } else {
    console.log(`\n✅ Project created at ${dest}`);
    console.log(
      `Run manually:\n  cd ${targetDir}\n  ${pkgManager} install\n  ${pkgManager} run dev`
    );
  }
}

main();
