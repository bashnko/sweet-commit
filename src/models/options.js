import { MODEL_CATALOG } from "../utils.js";

export function buildProvidersByModel(agents = []) {
  const map = new Map();

  function add(model, provider) {
    const modelName = String(model || "").trim();
    const providerName = String(provider || "").trim();
    if (!modelName || !providerName) {
      return;
    }
    if (!map.has(modelName)) {
      map.set(modelName, new Set());
    }
    map.get(modelName).add(providerName);
  }

  for (const entry of MODEL_CATALOG) {
    add(entry.model, entry.provider);
  }

  for (const agent of agents) {
    add(agent.model, agent.provider);
    add(agent.fallbackModel, agent.fallbackProvider || agent.provider);
  }

  return map;
}

export function toSelectOptions(models, providersByModel) {
  return models.map((model) => ({
    value: model,
    label: model,
    hint: providersByModel.get(model)
      ? `provider: ${[...providersByModel.get(model)].join(", ")}`
      : undefined,
  }));
}
