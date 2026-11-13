import { NextResponse } from "next/server";
import { pickMockReply } from "@/lib/mock-replies";

export const runtime = "edge";

const MODEL = process.env.OPENROUTER_MODEL ?? "x-ai/grok-4.1-fast:free";

/** Stream a canned reply in OpenAI SSE format so the UI can be tried locally. */
function mockStream(text: string, delayMs: number, signal: AbortSignal) {
  const encoder = new TextEncoder();
  const tokens = text.match(/\S+\s*|\s+/g) ?? [];
  return new ReadableStream({
    async start(controller) {
      await new Promise((r) => setTimeout(r, 450)); // "thinking"
      for (const token of tokens) {
        if (signal.aborted) break;
        const chunk = { choices: [{ delta: { content: token } }] };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        await new Promise((r) => setTimeout(r, delayMs));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

const sseHeaders = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

export async function POST(req: Request) {
  let messages: unknown;
  try {
    ({ messages } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const useMock =
    process.env.MOCK_CHAT === "1" ||
    (!apiKey && process.env.NODE_ENV !== "production");

  if (useMock) {
    const last = [...messages].reverse().find((m) => m?.role === "user");
    const reply = pickMockReply(String(last?.content ?? ""));
    if (reply.kind === "error") {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json({ error: reply.message }, { status: reply.status });
    }
    return new Response(mockStream(reply.text, reply.delayMs, req.signal), {
      headers: sseHeaders,
    });
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "The chat service isn't configured yet (missing API key)." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://localhost:3000",
        "X-Title": "Folio",
      },
      body: JSON.stringify({ model: MODEL, messages, stream: true }),
      signal: req.signal,
    });

    if (!response.ok || !response.body) {
      const detail = await response.text().catch(() => "");
      console.error("OpenRouter error", response.status, detail);
      const friendly =
        response.status === 401
          ? "The API key was rejected. Check OPENROUTER_API_KEY."
          : response.status === 429
            ? "The model is rate-limited right now. Please wait a moment and try again."
            : `The model provider returned an error (${response.status}).`;
      return NextResponse.json({ error: friendly }, { status: response.status || 502 });
    }

    // Pass the provider's SSE stream straight through; the client parses it.
    return new Response(response.body, { headers: sseHeaders });
  } catch (error) {
    if (req.signal.aborted) return new Response(null, { status: 499 });
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Couldn't reach the model provider. Check your connection and try again." },
      { status: 502 }
    );
  }
}
