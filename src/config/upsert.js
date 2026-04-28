import { getConfigLocation } from "./location.js"

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export async function upsertConfigEntries(entries) {
    const fs = await import("fs/promises")
    const { configDir, configFile } = getConfigLocation()
    await fs.mkdir(configDir, { recursive: true })

    let content = ""
    try {
        content = await fs.readFile(configFile, "utf8")
    } catch {}

    const lines = content ? content.split("\n") : []

    for (const [key, value] of Object.entries(entries)) {
        const keyPattern = new RegExp(`^\\s*${escapeRegExp(key)}\\s*=`)
        const nextLine = `${key}=${value}`
        const index = lines.findIndex((line) => keyPattern.test(line))
        if (index >= 0) {
            lines[index] = nextLine
            continue
        }
        if (lines.length > 0 && lines[lines.length - 1].trim() !== "") {
            lines.push("")
        }
        lines.push(nextLine)
    }

    const finalContent = `${lines.join("\n").replace(/\n*$/, "")}\n`
    await fs.writeFile(configFile, finalContent, "utf8")
    return { configFile }
}
