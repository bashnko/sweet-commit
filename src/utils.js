export async function loadConfig() {
  const fs = await import("fs/promises");
  const path = await import("path");
  const os = await import("os");
  let configPath = process.env.XDG_CONFIG_HOME
    ? path.join(process.env.XDG_CONFIG_HOME, "sweet-commit", ".scom.conf")
    : path.join(os.homedir(), ".config", "sweet-commit", ".scom.conf");
  let config = {};
  try {
    const content = await fs.readFile(configPath, "utf8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          let value = valueParts.join("=").replace(/^['"]?(.*?)['"]?$/, "$1");
          if (key === "humanLikeCommit") value = value === "true";
          config[key] = value;
        }
      }
    });
  } catch (error) {}
  return config;
}
