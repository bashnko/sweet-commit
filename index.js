#!/usr/bin/env node

import { createRequire } from "module";
import { execSync } from "child_process";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const args = process.argv.slice(2);
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

let styleFlagCount = 0;
for (const arg of args) {
  if (["--short", "-s"].includes(arg)) {
    process.env.SCOM_STYLE = "short";
    styleFlagCount++;
  } else if (["--adaptive", "-a"].includes(arg)) {
    process.env.SCOM_STYLE = "adaptive";
    styleFlagCount++;
  } else if (["--detailed", "-d"].includes(arg)) {
    process.env.SCOM_STYLE = "detailed";
    styleFlagCount++;
  } else if (arg.startsWith("-") && !["-v", "--version"].includes(arg)) {
    console.error(`Unknown flag: ${arg}`);
    console.log("\nUsage:");
    console.log("  scom --short     or -s     # Short commit message");
    console.log("  scom --adaptive  or -a     # Adaptive commit message");
    console.log("  scom --detailed  or -d     # Detailed commit message");
    console.log("  scom -v          or --version");
    console.log("  scom update");
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
