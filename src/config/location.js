import os from "os"
import path from "path"

export function getConfigLocation() {
    const customFile = process.env.SCOM_CONFIG
    if (customFile) {
        const configFile = path.resolve(customFile)
        return {
            configDir: path.dirname(configFile),
            configFile,
        }
    }

    const customDir = process.env.SCOM_CONFIG_DIR
    if (customDir) {
        const configDir = path.resolve(customDir)
        return {
            configDir,
            configFile: path.join(configDir, ".scom.conf"),
        }
    }

    if (os.platform() === "win32") {
        const configDir = path.join(
            process.env.APPDATA || os.homedir(),
            "sweet-commit",
        )
        return {
            configDir,
            configFile: path.join(configDir, ".scom.conf"),
        }
    }

    const configDir = process.env.XDG_CONFIG_HOME
        ? path.join(process.env.XDG_CONFIG_HOME, "sweet-commit")
        : path.join(os.homedir(), ".config", "sweet-commit")

    return {
        configDir,
        configFile: path.join(configDir, ".scom.conf"),
    }
}
