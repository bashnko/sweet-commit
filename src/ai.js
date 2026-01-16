import { GoogleGenAI } from "@google/genai";

export async function generateCommitMessage(
  apiKey,
  diff,
  style = "adaptive",
  humanLikeCommit = true,
) {
  let prompt;
  const humanHint = `\n- Make the commit message sound natural and human, as if written by a thoughtful developer.\n- Avoid robotic, formulaic, or overly formal language.\n- Do not use phrases like 'This commit' or 'AI-generated'.\n- Be concise, clear, and friendly.`;
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
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  let response = result.text.trim();
  response = response.replace(/^```[\s\S]*?\n/, "").replace(/\n```$/, "");
  response = response.replace(/\*\*(.*?)\*\*/g, "$1");
  return response;
}
