import fs from "fs"
import { execSync } from "child_process"
import { fileURLToPath } from "url"
import path from "path"
import { getConfigLocation } from "../utils.js"
import { runModelCommand } from "../model.js"

async function runUpdate() {
    try {
        console.log("Updating sweet-commit globally via npm...")
        execSync("npm update -g sweet-commit", { stdio: "inherit" })
    } catch (error) {
        console.error("Update failed:", error.message)
        process.exit(1)
    }
}

function runSetup() {
    try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const setupPath = path.join(__dirname, "..", "setup.js")
        if (!fs.existsSync(setupPath)) {
            console.error(`Setup script not found at: ${setupPath}`)
            process.exit(1)
        }
        console.log("Running sweet-commit setup...")
        execSync(`node "${setupPath}"`, { stdio: "inherit" })
    } catch (error) {
        console.error("Setup failed:", error.message)
        process.exit(1)
    }
}

function runConfig() {
    try {
        const { configFile } = getConfigLocation()
        if (fs.existsSync(configFile)) {
            console.log(`Active config file: ${configFile}`)
            console.log(
                "Tip: set SCOM_CONFIG to use a custom config file path.",
            )
            return
        }
        console.log(`Config file not found yet: ${configFile}`)
        console.log("Run 'scom setup' to create it.")
    } catch (error) {
        console.error("Unable to resolve config path:", error.message)
        process.exit(1)
    }
}

async function runModel(subcommand) {
    try {
        await runModelCommand(subcommand)
    } catch (error) {
        console.error("Model command failed:", error.message)
        process.exit(1)
    }
}

export async function handleBuiltInCommand(command, subcommand = "") {
    if (command === "update") {
        await runUpdate()
        return
    }
    if (command === "setup") {
        runSetup()
        return
    }
    if (command === "config") {
        runConfig()
        return
    }
    if (command === "model") {
        await runModel(subcommand)
    }
}
