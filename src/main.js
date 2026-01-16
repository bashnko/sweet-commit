import {
  checkStagedChanges,
  getFileStats,
  getStagedDiff,
  commitChanges,
} from "./git.js";
import { generateCommitMessage } from "./ai.js";
import { selectCommitStyle, p } from "./prompts.js";
import { loadConfig } from "./utils.js";

export async function main() {
  process.on("SIGINT", () => {
    p.cancel("Operation cancelled by user.");
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    p.cancel("Operation terminated.");
    process.exit(143);
  });
  process.on("unhandledRejection", (reason) => {
    p.cancel(`Unexpected error: ${reason}`);
    process.exit(1);
  });

  p.intro("sweet-commit");
  const config = await loadConfig();
  const apiKey = config.apiKey;
  if (!apiKey) {
    p.cancel(
      "API key not found in config. Please add 'apiKey=...' to your .scom.conf.",
    );
    process.exit(1);
  }
  const humanLikeCommit =
    config.humanLikeCommit !== undefined ? config.humanLikeCommit : true;
  let commitStyle = process.env.SCOM_STYLE || config.defaultCommitStyle;

  await checkStagedChanges(p);
  const fileStats = await getFileStats();
  const changesetSize = fileStats.length;
  let sizeDescription = "small";
  if (changesetSize > 50) sizeDescription = "very large";
  else if (changesetSize > 20) sizeDescription = "large";
  else if (changesetSize > 5) sizeDescription = "medium";
  p.note(
    `Analyzing ${sizeDescription} changeset with ${changesetSize} file${changesetSize === 1 ? "" : "s"}...\n` +
      `${fileStats.filter((f) => f.status === "A").length} added, ` +
      `${fileStats.filter((f) => f.status === "M").length} modified, ` +
      `${fileStats.filter((f) => f.status === "D").length} deleted`,
    "Changeset Overview",
  );
  let diff = await getStagedDiff();
  const diffLines = diff.split('\n');
  if (diffLines.length > 200) {
    diff = diffLines.slice(0, 200).join('\n') + '\n...diff truncated...';
  }

  if (!commitStyle) {
    commitStyle = await selectCommitStyle();
    if (p.isCancel(commitStyle)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
  }

  let message;
  while (true) {
    const spinner = p.spinner();
    spinner.start("Generating commit message...");
    try {
      message = await generateCommitMessage(
        apiKey,
        diff,
        commitStyle,
        humanLikeCommit,
      );
      spinner.stop();
    } catch (err) {
      spinner.stop("Failed to generate commit message.");
      p.cancel("Error generating commit message: " + err.message);
      process.exit(1);
    }
    p.note(message, "Generated commit message");
    const action = await p.select({
      message: "What do you want to do?",
      options: [
        { value: "okay", label: "Okay", hint: "Use this commit message" },
        { value: "again", label: "Generate Again", hint: "Regenerate message" },
      ],
    });
    if (p.isCancel(action)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
    if (action === "okay") {
      await commitChanges(message, p);
      p.outro("Done!");
      break;
    }
  }
}
