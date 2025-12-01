import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://localhost:3000", // Optional, for including your app on openrouter.ai rankings.
          "X-Title": "Local Chat App", // Optional. Shows in rankings on openrouter.ai.
        },
        body: JSON.stringify({
          model: "x-ai/grok-4.1-fast:free", // Default model, can be changed
          messages: messages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `OpenRouter API error: ${error}` },
        { status: response.status }
      );
    }

    // Create a TransformStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        // const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            // const chunk = decoder.decode(value);
            // OpenRouter/OpenAI streams data in "data: {...}\n\n" format
            // We just pass it through for now.
            // For simplicity in this step, let's pass the raw chunks and handle parsing on the client
            // or parse it here to be cleaner.
            // Let's pass it through as a raw stream for the client to parse SSE.
            controller.enqueue(value);
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
