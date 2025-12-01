"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SystemMessage,
  UserMessage,
  ThinkingIndicator,
} from "@/components/design-system/message-bubble";
import { FloatingInput } from "@/components/design-system/floating-input";
import { ChatSidebar } from "@/components/design-system/chat-sidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: string;
  updatedAt: Date;
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Update current chat in chats array whenever messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages,
                title: messages[0]?.content.slice(0, 50) || "New Chat",
                lastMessage: messages[messages.length - 1]?.content.slice(
                  0,
                  50
                ),
                updatedAt: new Date(),
              }
            : chat
        )
      );
    }
  }, [messages, currentChatId]);

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chats.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages);
      setIsSidebarOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Create a new chat if there isn't one
    if (!currentChatId) {
      const newChatId = `chat-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: inputValue.slice(0, 50),
        messages: [],
        updatedAt: new Date(),
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChatId);
    }

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              assistantMessage += content;

              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === "assistant") {
                  lastMessage.content = assistantMessage;
                }
                return newMessages;
              });
            } catch (e) {
              console.error("Error parsing JSON chunk", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen bg-paper-50">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6 pb-32">
            {messages.length === 0 && (
              <div className="text-center text-ink-faint mt-20">
                <h1 className="text-4xl font-serif text-ink mb-4">
                  Welcome back!
                </h1>
                <p className="text-lg">What are we going to crush today?</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[85%]">
                  {msg.role === "user" ? (
                    <UserMessage>{msg.content}</UserMessage>
                  ) : (
                    <SystemMessage>{msg.content}</SystemMessage>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <ThinkingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-paper-50 via-paper-50 to-transparent md:left-64">
          <div className="max-w-3xl mx-auto">
            <FloatingInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
