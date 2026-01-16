#!/usr/bin/env node

import { createRequire } from "module";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const args = process.argv.slice(2);

if (args.includes('--short') || args.includes('-s')) {
  process.env.SCOM_STYLE = 'short';
}
if (args.includes('--adaptive') || args.includes('-a')) {
  process.env.SCOM_STYLE = 'adaptive';
}
if (args.includes('--detailed') || args.includes('-d')) {
  process.env.SCOM_STYLE = 'detailed';
}
if (args.includes("-v") || args.includes("--version")) {
  console.log(pkg.version);
  process.exit(0);
}

if (args[0] === "update") {
  try {
    console.log("Updating sweet-commit globally via npm...");
    execSync("npm update -g sweet-commit", { stdio: "inherit" });
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err.message);
    process.exit(1);
  }
}

if (args[0] === "setup") {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const setupPath = path.join(__dirname, "src", "setup.js");
    if (!fs.existsSync(setupPath)) {
      console.error(`Setup script not found at: ${setupPath}`);
      process.exit(1);
    }
    console.log("Running sweet-commit setup...");
    execSync(`node "${setupPath}"`, { stdio: "inherit" });
    process.exit(0);
  } catch (err) {
    console.error("Setup failed:", err.message);
    process.exit(1);
  }
}

if (
  args[0] &&
  ![
    "--short",
    "-s",
    "--adaptive",
    "-a",
    "--detailed",
    "-d",
    "-v",
    "--version",
    "update",
  ].includes(args[0]) &&
  !args[0].startsWith("-")
) {
  console.error(`Unknown command: ${args[0]}`);
  console.log("\nUsage:");
  console.log("  scom --short     or -s     # Short commit message");
  console.log("  scom --adaptive  or -a     # Adaptive commit message");
  console.log("  scom --detailed  or -d     # Detailed commit message");
  console.log("  scom -v          or --version");
  console.log("  scom update");
  process.exit(1);
}

import { main } from "./src/main.js";
main().catch((error) => {
  console.error("Unexpected error:", error.message);
  process.exit(1);
});
