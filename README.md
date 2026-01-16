# sweet-commit

[![npm version](https://img.shields.io/npm/v/sweet-commit)](https://www.npmjs.com/package/sweet-commit)

AI-powered commit messages that just work. One command, perfect commits, every time.

## Installation

```bash
npm install -g sweet-commit
```

## Update

To update to the latest version:

```bash
scom update
```

Check your current version:

```bash
scom -v
```

## Usage

### Basic usage

Generate and commit (will prompt to stage if needed):

```bash
scom
```

You can also specify the commit style directly with a flag. For example:

```bash
scom -s       # Short commit message
scom --adaptive   # Adaptive commit message
scom -d       # Detailed commit message
```

### Commit style flags

You can control the commit message style directly from the CLI:

- `scom --short` or `scom -s` — Short, conventional commit message
- `scom --adaptive` or `scom -a` — Adaptive (short for simple, detailed for complex)
- `scom --detailed` or `scom -d` — Fully detailed, multi-line commit message

> **Note:** CLI flags always override your config file's default style.

### What happens

- Checks for unstaged changes and offers to stage them automatically
- Analyzes your changes using AI
- Generates a commit message in your chosen style
- Lets you confirm or regenerate the message
- Commits after confirmation

## Setup

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Run the setup command:

   ```bash
   scom setup
   ```

3. Follow the prompts to enter your API key. That's it!

### About the .scom.conf file

When you run `scom setup`, a `.scom.conf` file is created in your config directory (e.g. `~/.config/.scom.conf` and inside `APPDATA` for windows).

- This file securely stores your Gemini API key and other configuration options, such as your default commit style.
- You can edit this file manually if you want to change your API key or set a different default commit style (e.g., `adaptive`, `short`, or `detailed`).
- Example `.scom.conf`:

  ```ini
  apiKey=your-gemini-api-key
  humanLikeCommit=true
  defaultCommitStyle=adaptive
  ```

> **Note:** CLI flags (like `--short`, `--adaptive`, `--detailed`) always override the style set in `.scom.conf` for a single run.

## Features

- **Flexible commit styles**: Use CLI flags to choose short, adaptive, or detailed commit messages on demand
- **Auto-stage prompt**: Automatically offers to stage unstaged changes
- **Intelligent message generation**: Comprehensive bodies for complex changes, concise for simple ones
- **Conventional commits**: Follows best practices and conventional commit format
- **Gemini AI powered**: Uses latest Gemini AI for intelligent commit message creation
- **Clean interface**: Minimal, beautiful CLI with no unnecessary output
- **Zero configuration**: Works immediately after API key setup
- **Flexible setup**: Supports environment variables and .env files

## Dependencies

- @clack/prompts - Clean CLI interface
- @google/genai - Gemini AI integration

## Requirements

- Node.js 20 or later
- Git repository with staged changes
- Gemini API key
