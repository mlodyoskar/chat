export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  /** Set when the request for this assistant message failed. */
  error?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export function createId(prefix = "id") {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${random}`;
}

export function deriveTitle(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 48) return clean || "New conversation";
  return clean.slice(0, 48).replace(/\s+\S*$/, "") + "…";
}

/** Group chats for the sidebar: Today / Yesterday / Previous 7 days / Older. */
export function groupChatsByDate(chats: Chat[], now = Date.now()) {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const today = startOfToday.getTime();
  const day = 86_400_000;

  const groups: { label: string; chats: Chat[] }[] = [
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Previous 7 days", chats: [] },
    { label: "Older", chats: [] },
  ];

  for (const chat of [...chats].sort((a, b) => b.updatedAt - a.updatedAt)) {
    if (chat.updatedAt >= today) groups[0].chats.push(chat);
    else if (chat.updatedAt >= today - day) groups[1].chats.push(chat);
    else if (chat.updatedAt >= today - 7 * day) groups[2].chats.push(chat);
    else groups[3].chats.push(chat);
  }

  return groups.filter((g) => g.chats.length > 0);
}

/**
 * Parse an OpenAI-compatible SSE stream, yielding text deltas.
 * Buffers partial lines so JSON split across network chunks is not lost.
 */
export async function* readChatStream(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) return;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const raw of lines) {
        const line = raw.trim();
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            throw new Error(parsed.error.message ?? "The model returned an error.");
          }
          const delta: string = parsed.choices?.[0]?.delta?.content ?? "";
          if (delta) yield delta;
        } catch (e) {
          if (e instanceof SyntaxError) continue; // keep-alive / comment frames
          throw e;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
