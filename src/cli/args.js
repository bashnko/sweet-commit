export function parseCliArgs(args) {
    const positionals = []
    let showVersion = false

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i]

        if (arg === "--short" || arg === "-s") {
            process.env.SCOM_STYLE = "short"
            continue
        }
        if (arg === "--adaptive" || arg === "-a") {
            process.env.SCOM_STYLE = "adaptive"
            continue
        }
        if (arg === "--detailed" || arg === "-d") {
            process.env.SCOM_STYLE = "detailed"
            continue
        }
        if (arg === "-v" || arg === "--version") {
            showVersion = true
            continue
        }
        if (arg === "--agent") {
            const value = args[i + 1]
            if (!value || value.startsWith("-")) {
                console.error(
                    "Missing value for --agent. Example: scom --agent primary",
                )
                process.exit(1)
            }
            process.env.SCOM_AGENT = value
            i += 1
            continue
        }
        if (arg.startsWith("--agent=")) {
            process.env.SCOM_AGENT = arg.slice("--agent=".length)
            continue
        }

        if (!arg.startsWith("-")) {
            positionals.push(arg)
            continue
        }

        console.error(`Unknown argument: ${arg}`)
        printUsageAndExit(1)
    }

    return {
        showVersion,
        command: positionals[0] || null,
        subcommand: positionals[1] || "",
    }
}

export function printUsageAndExit(exitCode = 0) {
    console.log("\nUsage:")
    console.log("  scom --short     or -s")
    console.log("  scom --adaptive  or -a")
    console.log("  scom --detailed  or -d")
    console.log("  scom --agent <name>")
    console.log("  scom -v          or --version")
    console.log("  scom setup")
    console.log("  scom config")
    console.log("  scom model")
    console.log("  scom model show")
    console.log("  scom update")
    process.exit(exitCode)
}
