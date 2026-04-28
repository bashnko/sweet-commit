import * as p from "@clack/prompts"

export async function selectCommitStyle() {
    return await p.select({
        message: "What sort of commit do you want to generate?",
        options: [
            {
                value: "short",
                label: "Short",
                hint: "Short, conventional commit message",
            },
            {
                value: "adaptive",
                label: "Adaptive",
                hint: "Adaptive, based on changes",
            },
            {
                value: "detailed",
                label: "Detailed",
                hint: "Fully detailed and long",
            },
        ],
    })
}

export async function selectAiAgent(agents, initialValue) {
    return await p.select({
        message: "Which AI agent do you want to use?",
        initialValue,
        options: agents.map((agent) => ({
            value: agent.name,
            label: `${agent.name} (${agent.provider})`,
            hint: agent.model,
        })),
    })
}

export { p }
