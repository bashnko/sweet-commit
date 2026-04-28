import { MODEL_CATALOG, PROVIDER_DEFAULTS } from "./constants.js"
import { getValue } from "./loader.js"

export function getGlobalModelPreferences(config) {
    const defaultModel = getValue(
        config,
        ["DEFAULT_MODEL", "defaultModel", "MODEL", "MODER", "model", "moder"],
        "",
    )
    const fallbackModel = getValue(
        config,
        ["FALLBACK_MODEL", "fallbackModel"],
        "",
    )
    return { defaultModel, fallbackModel }
}

export function getConfiguredModelList(config, agents = []) {
    const values = new Set()
    const { defaultModel, fallbackModel } = getGlobalModelPreferences(config)

    if (defaultModel) {
        values.add(defaultModel)
    }
    if (fallbackModel) {
        values.add(fallbackModel)
    }

    for (const agent of agents) {
        if (agent.model) {
            values.add(String(agent.model).trim())
        }
        if (agent.fallbackModel) {
            values.add(String(agent.fallbackModel).trim())
        }
    }

    for (const defaults of Object.values(PROVIDER_DEFAULTS)) {
        if (defaults.model) {
            values.add(defaults.model)
        }
    }

    for (const entry of MODEL_CATALOG) {
        if (entry.model) {
            values.add(entry.model)
        }
    }

    return [...values].filter(Boolean)
}
