#!/usr/bin/env node
import readline from 'readline';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

function getConfigPath() {
  const platform = os.platform();
  let configDir, configFile;
  if (platform === 'win32') {
    configDir = path.join(process.env.APPDATA || os.homedir(), 'sweet-commit');
    configFile = path.join(configDir, '.scom.conf');
  } else {
    configDir = path.join(os.homedir(), '.config', 'sweet-commit');
    configFile = path.join(configDir, '.scom.conf');
  }
  return { configDir, configFile };
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log('[sweet-commit setup]');
  const { configDir, configFile } = getConfigPath();
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  let apiKey = await prompt('Enter your Gemini API key: ');
  apiKey = apiKey.trim();
  if (!apiKey) {
    console.error('API key is required. Exiting.');
    process.exit(1);
  }
  const config = `# sweet-commit configuration\n#\n# This file contains all available options for sweet-commit.\n#\n# apiKey: Your Gemini API key (required)\napiKey=${apiKey}\n#\n# humanLikeCommit: Generate more human-like commit messages (true/false)\n# Default: true\nhumanLikeCommit=true\n#\n# defaultCommitStyle: Set your preferred commit style (short, adaptive, detailed)\n# Default: adaptive\ndefaultCommitStyle=adaptive\n`;
  fs.writeFileSync(configFile, config, 'utf8');
  console.log(`Config file created at ${configFile}`);
  console.log('Setup complete! You can now use sweet-commit.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export default main;
