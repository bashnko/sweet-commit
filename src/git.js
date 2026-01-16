import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

const DIFF_CONFIG = {
  maxBuffer: 50 * 1024 * 1024,
};

export async function execGit(command, options = {}) {
  try {
    const { stdout } = await execPromise(command, {
      maxBuffer: DIFF_CONFIG.maxBuffer,
      ...options,
    });
    return stdout;
  } catch (error) {
    if (error.message.includes("maxBuffer length exceeded")) {
      throw new Error(
        `The changeset is extremely large (>50MB). Consider committing files in smaller batches.`,
      );
    }
    throw error;
  }
}

export async function checkStagedChanges(p) {
  try {
    const stdout = await execGit("git status --porcelain");
    const hasStagedChanges = stdout
      .split("\n")
      .some(
        (line) =>
          line.startsWith("A ") ||
          line.startsWith("M ") ||
          line.startsWith("D ") ||
          line.startsWith("R "),
      );

    if (!hasStagedChanges) {
      const hasUnstagedChanges = stdout
        .split("\n")
        .some(
          (line) =>
            line.startsWith(" M") ||
            line.startsWith("??") ||
            line.startsWith(" D") ||
            line.startsWith("AM") ||
            line.startsWith("MM"),
        );

      if (hasUnstagedChanges) {
        p.note(
          "No staged changes found, but you have unstaged changes.",
          "Nothing to commit",
        );
        let shouldStageAll;
        try {
          shouldStageAll = await p.confirm({
            message: "Do you want to stage all changes?",
            initialValue: true,
          });
        } catch (error) {
          p.cancel("Operation cancelled.");
          process.exit(130);
        }
        if (p.isCancel(shouldStageAll) || shouldStageAll !== true) {
          p.cancel("Stage your changes first with: git add <files>");
          process.exit(0);
        }
        const spinner = p.spinner();
        spinner.start("Staging all changes...");
        try {
          await execGit("git add .");
          spinner.stop("All changes staged!");
        } catch (error) {
          spinner.stop("Failed to stage changes.");
          p.cancel(`Unable to stage changes: ${error.message}`);
          process.exit(1);
        }
      } else {
        p.cancel("No changes found. Make some changes first.");
        process.exit(1);
      }
    }
  } catch (error) {
    p.cancel(`Unable to check git status: ${error.message}`);
    process.exit(1);
  }
}

export async function getFileStats() {
  try {
    const stdout = await execGit("git diff --cached --name-status");
    const files = stdout
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [status, ...pathParts] = line.split("\t");
        return { status, path: pathParts.join("\t") };
      });
    return files;
  } catch (error) {
    throw new Error(`Unable to analyze changed files: ${error.message}`);
  }
}

export async function getStagedDiff() {
  try {
    const stdout = await execGit("git diff --cached");
    return stdout;
  } catch (error) {
    throw new Error(`Unable to get staged changes: ${error.message}`);
  }
}

export async function commitChanges(message, p) {
  if (!message || message.trim().length === 0) {
    p.cancel("Cannot commit with empty message.");
    process.exit(1);
  }
  const os = await import("os");
  const path = await import("path");
  const fs = await import("fs/promises");
  const spinner = p.spinner();
  spinner.start("Committing changes...");
  let tempFile;
  try {
    tempFile = path.join(os.tmpdir(), `scom-${Date.now()}.txt`);
    await fs.writeFile(tempFile, message, "utf8");
    await execGit(`git commit -F "${tempFile}"`);
    await fs.unlink(tempFile);
    spinner.stop("Committed successfully!");
  } catch (error) {
    spinner.stop("Commit failed!");
    if (tempFile) {
      try {
        await fs.unlink(tempFile);
      } catch {}
    }
    p.cancel(`Unable to create commit: ${error.message}`);
    process.exit(1);
  }
}
