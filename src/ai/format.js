export function cleanupModelResponse(text) {
  let response = String(text || "").trim();
  response = response.replace(/^```[\s\S]*?\n/, "").replace(/\n```$/, "");
  response = response.replace(/\*\*(.*?)\*\*/g, "$1");
  return response;
}

function isConventionalSubject(line) {
  return /^[a-z]+(?:\([^)]+\))?!?:\s+.+/.test(line);
}

function toConventionalSubject(line) {
  const clean = String(line || "").trim().replace(/[.\s]+$/, "");
  if (!clean) {
    return "chore: update project files";
  }
  if (isConventionalSubject(clean)) {
    return clean;
  }
  const normalized = clean.charAt(0).toLowerCase() + clean.slice(1);
  return `chore: ${normalized}`;
}

function isChatterLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  const chatterPatterns = [
    /^this commit\b/i,
    /^if you'd like\b/i,
    /^here's an expanded commit message\b/i,
    /^in this commit\b/i,
    /^here are the specific changes\b/i,
    /^the readme now\b/i,
    /^these changes will\b/i,
  ];

  return chatterPatterns.some((pattern) => pattern.test(trimmed));
}

function dedupeLines(lines) {
  const seen = new Set();
  const output = [];

  for (const line of lines) {
    const key = line.trim().toLowerCase();
    if (!key) {
      output.push("");
      continue;
    }
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(line);
  }

  return output;
}

export function enforceCommitMessageShape(rawMessage, style = "adaptive") {
  const lines = String(rawMessage || "")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""));

  let subject = "";
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (isConventionalSubject(trimmed)) {
      subject = trimmed;
      break;
    }
  }

  if (!subject) {
    subject = toConventionalSubject(lines.find((line) => line.trim()) || "");
  }

  const bodyCandidates = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (trimmed === subject) {
      continue;
    }
    if (isConventionalSubject(trimmed) || isChatterLine(trimmed)) {
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      bodyCandidates.push(`- ${trimmed.replace(/^[-*]\s+/, "").trim()}`);
      continue;
    }

    if (style !== "short") {
      bodyCandidates.push(`- ${trimmed.replace(/[.]$/, "")}`);
    }
  }

  const maxBodyLines = style === "detailed" ? 8 : 4;
  const cleanBody = dedupeLines(bodyCandidates)
    .filter((line) => line.trim())
    .slice(0, maxBodyLines);

  if (style === "short" || cleanBody.length === 0) {
    return subject;
  }

  return `${subject}\n\n${cleanBody.join("\n")}`;
}
