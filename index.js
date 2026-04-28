#!/usr/bin/env node

import { createRequire } from "module";
import { main } from "./src/main.js";
import { handleBuiltInCommand } from "./src/cli/commands.js";
import { parseCliArgs, printUsageAndExit } from "./src/cli/args.js";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const { showVersion, command, subcommand } = parseCliArgs(process.argv.slice(2));

if (showVersion) {
  console.log(pkg.version);
  process.exit(0);
}

if (command && !["setup", "update", "config", "model"].includes(command)) {
  console.error(`Unknown command: ${command}`);
  printUsageAndExit(1);
}

if (command) {
  await handleBuiltInCommand(command, subcommand);
  process.exit(0);
}

main().catch((error) => {
  console.error("Unexpected error:", error.message);
  process.exit(1);
});
