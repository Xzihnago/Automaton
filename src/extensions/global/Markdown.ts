export const mentionUser = (id: string) => `<@${id}>` as const;

export const mentionRole = (id: string) => `<@&${id}>` as const;

export const timestamps = <K extends "D" | "d" | "F" | "f" | "R" | "T" | "t" | undefined = undefined>(
  timestamp: number,
  style?: K,
) =>
  (style ? `<t:${timestamp}:${style}>` : `<t:${timestamp}>`) as K extends undefined
    ? `<t:${number}>`
    : `<t:${number}:${K}>`;

export const codeblocks = (text: string, lang = "") => {
  if (text.includes("\n")) {
    return `\`\`\`${lang}\n${text}\`\`\`` as const;
  } else {
    return `\`${text}\`` as const;
  }
};
