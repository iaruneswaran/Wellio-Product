import type { UIMessage } from "ai";
export type ChatThread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };
const key = "wellio-chat-threads-v1";
const legacyKey = "wrute-chat-threads-v1";
export function loadThreads(): ChatThread[] {
  try {
    const raw = localStorage.getItem(key) ?? localStorage.getItem(legacyKey) ?? "[]";
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter(
          (t): t is ChatThread =>
            typeof t?.id === "string" && typeof t?.title === "string" && Array.isArray(t?.messages),
        )
      : [];
  } catch {
    return [];
  }
}
export function saveThreads(threads: ChatThread[]) {
  localStorage.setItem(key, JSON.stringify(threads));
}
export function createThread(): ChatThread {
  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}
export const chatMeta = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
