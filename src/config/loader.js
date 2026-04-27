import { getConfigLocation } from "./location.js";

export function parseBoolean(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }
  const normalized = String(value).toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }
  return fallback;
}

export function getValue(config, keys, fallback = "") {
  for (const key of keys) {
    if (config[key] !== undefined && config[key] !== "") {
      return String(config[key]).trim();
    }
  }
  return fallback;
}

export async function loadConfig() {
  const fs = await import("fs/promises");
  const { configFile } = getConfigLocation();
  const config = {};

  try {
    const content = await fs.readFile(configFile, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const [key, ...valueParts] = trimmed.split("=");
      if (!key || valueParts.length === 0) {
        continue;
      }
      let value = valueParts.join("=").replace(/^['"]?(.*?)['"]?$/, "$1");
      if (key === "humanLikeCommit") {
        value = parseBoolean(value, true);
      }
      config[key] = value;
    }
  } catch {
    return config;
  }

  return config;
}
