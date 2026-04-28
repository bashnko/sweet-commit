function buildToneRules(humanLikeCommit) {
    if (!humanLikeCommit) {
        return ""
    }

    return `
Tone:
- Keep it natural and concise.
- Do not sound like a release note or an AI assistant.
- Do not use phrases like "This commit" or "AI-generated".
- Keep the subject lowercase after the colon.
- Do not end the subject with a period.`
}

function buildOutputContract(style) {
    if (style === "short") {
        return `
Output contract:
- Output plain text only.
- Exactly one subject line.
- Subject format: type(scope): description or type: description.
- Subject length <= 72 characters.
- No body unless absolutely necessary.`
    }

    if (style === "detailed") {
        return `
Output contract:
- Output plain text only.
- Subject first line in conventional commit format.
- Add a blank line, then body bullets only.
- 2 to 6 bullets, each starting with '- '.
- Each bullet describes one concrete change or reason.
- No paragraphs.`
    }

    return `
Output contract:
- Output plain text only.
- Subject first line in conventional commit format.
- If the diff is small/simple, return subject only.
- If the diff is medium/large, add a blank line and 1 to 4 body bullets.
- Body bullets only, no paragraphs.`
}

function buildCoreRules() {
    return `
Rules:
- Choose the most specific type from: feat, fix, refactor, perf, docs, test, build, ci, chore, revert.
- Scope should match the main area changed (module, package, feature, command).
- Use imperative mood.
- Describe what changed and why, not implementation trivia.
- Mention breaking changes only if the diff clearly indicates one.
- Avoid vague text like "update files" or "misc changes".
- Do not include code fences, quotes, headings, or explanations outside the commit message.`
}

function buildExamples(style) {
    if (style === "short") {
        return `
Examples:
feat(cli): add --agent flag for provider selection
fix(config): resolve fallback model lookup on startup`
    }

    return `
Examples:
refactor(model): split selection workflow into helper modules

- move provider map creation into a dedicated options helper
- isolate api key prompting from model selection flow
- reduce model command complexity for easier maintenance

fix(ai): normalize fallback response parsing

- handle array content payloads from chat completion providers
- preserve subject formatting when body is omitted`
}

function buildPrompt(diff, style = "adaptive", humanLikeCommit = true) {
    return `You generate a single high-quality git commit message from a staged diff.
${buildOutputContract(style)}
${buildCoreRules()}
${buildToneRules(humanLikeCommit)}
${buildExamples(style)}

Git diff:
${diff}`
}

export { buildPrompt }
