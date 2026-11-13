"use client";

import { useCallback, useEffect, useState } from "react";
import type { Chat } from "@/lib/chat";

const STORAGE_KEY = "folio.chats.v1";

function load(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Chat history persisted to localStorage so a refresh never loses work. */
export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setChats(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      } catch {
        // Storage full or unavailable — history just won't persist.
      }
    }, 250);
    return () => clearTimeout(id);
  }, [chats, hydrated]);

  const updateChat = useCallback(
    (id: string, update: (chat: Chat) => Chat) =>
      setChats((prev) => prev.map((c) => (c.id === id ? update(c) : c))),
    []
  );

  const deleteChat = useCallback(
    (id: string) => setChats((prev) => prev.filter((c) => c.id !== id)),
    []
  );

  return { chats, setChats, updateChat, deleteChat, hydrated };
}
