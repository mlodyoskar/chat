"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, PanelLeftOpen, SquarePen } from "lucide-react";
import {
  Markdown,
  MessageActions,
  MessageError,
  ThinkingIndicator,
  UserMessage,
} from "@/components/design-system/message-bubble";
import { FloatingInput } from "@/components/design-system/floating-input";
import { ChatSidebar, Logo } from "@/components/design-system/chat-sidebar";
import { EmptyState } from "@/components/chat/empty-state";
import { useChats } from "@/hooks/use-chats";
import {
  createId,
  deriveTitle,
  readChatStream,
  type Chat,
  type Message,
} from "@/lib/chat";
import { cn } from "@/lib/utils";

export default function Home() {
  const { chats, setChats, updateChat, deleteChat, hydrated } = useChats();
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages ?? [];
  const isLoading = streamingId !== null;

  // Sidebar starts open on desktop, closed on mobile.
  useEffect(() => {
    setIsSidebarOpen(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  const isMobile = () => !window.matchMedia("(min-width: 768px)").matches;

  // ---- Scrolling -----------------------------------------------------------
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  // Follow new content only if the reader hasn't scrolled up.
  const lastContent = messages[messages.length - 1]?.content;
  useEffect(() => {
    if (isAtBottom) scrollToBottom(isLoading ? "auto" : "smooth");
  }, [messages.length, lastContent, isAtBottom, isLoading, scrollToBottom]);

  // Jump to the bottom when switching conversations.
  useEffect(() => {
    scrollToBottom("auto");
    setIsAtBottom(true);
  }, [currentChatId, scrollToBottom]);

  // ---- Chat actions --------------------------------------------------------
  const stop = useCallback(() => abortRef.current?.abort(), []);

  const newChat = useCallback(() => {
    stop();
    setCurrentChatId(undefined);
    setInput("");
    if (isMobile()) setIsSidebarOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [stop]);

  const selectChat = (id: string) => {
    if (id !== currentChatId) stop();
    setCurrentChatId(id);
    if (isMobile()) setIsSidebarOpen(false);
  };

  const removeChat = (id: string) => {
    if (id === currentChatId) {
      stop();
      setCurrentChatId(undefined);
    }
    deleteChat(id);
  };

  /** Stream an assistant reply for `history` into chat `chatId`. */
  const streamReply = async (chatId: string, history: Message[]) => {
    const assistant: Message = {
      id: createId("msg"),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };
    updateChat(chatId, (c) => ({
      ...c,
      messages: [...history, assistant],
      updatedAt: Date.now(),
    }));
    setStreamingId(assistant.id);

    const controller = new AbortController();
    abortRef.current = controller;

    const patch = (fields: Partial<Message>) =>
      updateChat(chatId, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === assistant.id ? { ...m, ...fields } : m
        ),
      }));

    let content = "";
    let frame = 0;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status}).`);
      }

      for await (const delta of readChatStream(res.body, controller.signal)) {
        content += delta;
        // Batch UI updates to one per animation frame.
        if (!frame) {
          frame = requestAnimationFrame(() => {
            frame = 0;
            patch({ content });
          });
        }
      }
      cancelAnimationFrame(frame);
      patch({ content });
    } catch (err) {
      cancelAnimationFrame(frame);
      if (controller.signal.aborted) {
        patch({ content });
      } else {
        patch({
          content,
          error:
            err instanceof Error ? err.message : "The response could not be completed.",
        });
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setStreamingId((id) => (id === assistant.id ? null : id));
    }
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: createId("msg"),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    let chatId = currentChatId;
    let history: Message[];
    if (!chatId || !currentChat) {
      const chat: Chat = {
        id: createId("chat"),
        title: deriveTitle(trimmed),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      chatId = chat.id;
      history = [userMessage];
      setChats((prev) => [chat, ...prev]);
      setCurrentChatId(chat.id);
    } else {
      // Drop a trailing failed reply so it isn't sent back to the model.
      const clean = currentChat.messages.filter((m) => !m.error);
      history = [...clean, userMessage];
    }

    setInput("");
    setIsAtBottom(true);
    void streamReply(chatId, history);
  };

  const regenerate = () => {
    if (!currentChat || isLoading) return;
    const msgs = currentChat.messages;
    const lastUser = msgs.findLastIndex((m) => m.role === "user");
    if (lastUser === -1) return;
    void streamReply(currentChat.id, msgs.slice(0, lastUser + 1));
  };

  // ---- Keyboard shortcuts --------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        newChat();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        setIsSidebarOpen((o) => !o);
      } else if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [newChat]);

  // ---- Render --------------------------------------------------------------
  const isEmpty = messages.length === 0;
  const lastAssistantIndex = messages.findLastIndex((m) => m.role === "assistant");

  return (
    <div className="flex h-dvh overflow-hidden bg-paper-50">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={selectChat}
        onNewChat={newChat}
        onDeleteChat={removeChat}
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="z-10 flex h-14 shrink-0 items-center gap-1 border-b border-transparent px-3 sm:px-4">
          {!isSidebarOpen && (
            <>
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
                title="Open sidebar (⌘\)"
                className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-paper-100 hover:text-ink"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </button>
              <button
                onClick={newChat}
                aria-label="New conversation"
                title="New conversation (⌘K)"
                className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-paper-100 hover:text-ink"
              >
                <SquarePen className="h-5 w-5" />
              </button>
              <Logo className="ml-2 md:hidden" />
            </>
          )}
          <h2 className="ml-2 hidden min-w-0 truncate font-serif text-base text-ink-muted md:block">
            {currentChat?.title}
          </h2>
        </header>

        {/* Conversation */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto"
        >
          {isEmpty ? (
            <div
              className={cn(
                "flex min-h-full items-center justify-center px-4 pb-8 pt-4 transition-opacity duration-300",
                hydrated ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="w-full max-w-2xl">
                <EmptyState onPick={send} />
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4 sm:px-6">
              <ol className="space-y-8" aria-live="polite">
                {messages.map((msg, i) => {
                  const streaming = msg.id === streamingId;
                  if (msg.role === "user") {
                    return (
                      <li
                        key={msg.id}
                        className="animate-message-in flex justify-end pl-10 sm:pl-24"
                      >
                        <UserMessage>{msg.content}</UserMessage>
                      </li>
                    );
                  }
                  return (
                    <li key={msg.id} className="animate-message-in group/msg">
                      {msg.content ? (
                        <Markdown content={msg.content} streaming={streaming} />
                      ) : streaming ? (
                        <ThinkingIndicator />
                      ) : null}

                      {msg.error && (
                        <div className={cn(msg.content && "mt-4")}>
                          <MessageError
                            message={msg.error}
                            onRetry={i === lastAssistantIndex ? regenerate : undefined}
                          />
                        </div>
                      )}

                      {!streaming && msg.content && (
                        <MessageActions
                          content={msg.content}
                          onRegenerate={
                            i === lastAssistantIndex && !isLoading ? regenerate : undefined
                          }
                          className={cn(
                            "-ml-1.5 mt-2 transition-opacity",
                            i === lastAssistantIndex
                              ? "opacity-100"
                              : "opacity-0 focus-within:opacity-100 group-hover/msg:opacity-100 max-md:opacity-100"
                          )}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="relative shrink-0 px-3 pb-3 sm:px-6 sm:pb-5">
          <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-paper-50 to-transparent" />

          <button
            onClick={() => scrollToBottom()}
            aria-label="Scroll to latest message"
            className={cn(
              "absolute -top-12 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-paper-200 bg-white text-ink-muted shadow-float transition-all hover:text-brand",
              isAtBottom || isEmpty
                ? "pointer-events-none translate-y-2 opacity-0"
                : "opacity-100"
            )}
          >
            <ArrowDown className="h-4 w-4" />
          </button>

          <div className="mx-auto max-w-3xl">
            <FloatingInput
              inputRef={inputRef}
              value={input}
              onChange={setInput}
              onSubmit={() => send(input)}
              onStop={stop}
              isLoading={isLoading}
              autoFocus
              placeholder={isEmpty ? "Ask anything…" : "Reply…"}
            />
            <p className="mt-2 text-center text-[11px] text-ink-faint">
              AI can make mistakes. Check important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
