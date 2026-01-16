import * as p from "@clack/prompts";

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
      { value: "detailed", label: "Detailed", hint: "Fully detailed and long" },
    ],
  });
}

export async function confirmCommit() {
  return await p.confirm({
    message: "Commit with this message?",
    initialValue: true,
  });
}

export async function askGenerateOther() {
  return await p.confirm({
    message: "Generate another message?",
    initialValue: false,
  });
}

export { p };
