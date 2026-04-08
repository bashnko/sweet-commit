import { GoogleGenAI } from "@google/genai";

export async function generateCommitMessage(
  apiKey,
  diff,
  style = "adaptive",
  humanLikeCommit = true,
) {
  let prompt;
  let humanHint = `\nWrite commit messages like a real developer:
After the colon in the subject (e.g., "feat(scope): description"), always start the description with a lowercase letter, not uppercase. For example, use "feat(core): add new feature" instead of "feat(core): Add new feature".
Avoid perfect grammar; be a bit informal and natural.
Use contractions (don't, can't, it's) where appropriate.
Do not add a period at the end of the subject line.
Prefer short, direct sentences.
Avoid robotic or overly formal language.
If the change is trivial, keep the message casual and concise.
If the commit message body is long or detailed, use bullet points (with '-') for each explanation or change, e.g.:
  - add this feat in x component
  - remove this component from this feat
Do not use phrases like "This commit" or "AI-generated".
Make the message sound like it was written by a thoughtful, but relaxed, human developer.`;
  const maybeHumanHint = humanLikeCommit ? humanHint : "";
  if (style === "short") {
    prompt = `Generate a short, conventional commit message for the following git diff.\n- Use conventional commit format: type(scope): description\n- Keep the subject line under 72 characters.\n- No body unless absolutely necessary.\n- Use imperative mood.\n- No markdown, just plain text.${maybeHumanHint}\n\nGit diff:\n${diff}`;
  } else if (style === "detailed") {
    prompt = `Generate a detailed, conventional commit message for the following git diff.\n- Use conventional commit format: type(scope): description\n- Add a detailed body explaining what changed, why, and any breaking changes.\n- Use bullet points for multiple changes.\n- Body lines should wrap at 72 characters.\n- Separate subject from body with a blank line.\n- Use imperative mood.\n- No markdown, just plain text.${maybeHumanHint}\n\nGit diff:\n${diff}`;
  } else {
    prompt = `Generate an adaptive, conventional commit message for the following git diff.\n- Use conventional commit format: type(scope): description\n- If the change is simple, keep the message short.\n- If the change is complex, add a body with details.\n- Use imperative mood.\n- No markdown, just plain text.${maybeHumanHint}\n\nGit diff:\n${diff}`;
  }
  const ai = new GoogleGenAI({ apiKey });
  const result = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });
  let response = result.text.trim();
  response = response.replace(/^```[\s\S]*?\n/, "").replace(/\n```$/, "");
  response = response.replace(/\*\*(.*?)\*\*/g, "$1");
  return response;
}
