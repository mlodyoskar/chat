"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  LogIn,
  MessageSquareText,
  PanelLeftClose,
  Search,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { groupChatsByDate, type Chat } from "@/lib/chat";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  currentChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand font-serif text-base font-bold italic text-white shadow-paper">
        F
      </span>
      <span className="font-serif text-xl font-semibold tracking-tight text-ink">
        Folio
      </span>
    </span>
  );
}

export function ChatSidebar({
  isOpen,
  onClose,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? chats.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.messages.some((m) => m.content.toLowerCase().includes(q))
        )
      : chats.filter((c) => c.messages.length > 0);
    return groupChatsByDate(filtered);
  }, [chats, query]);

  return (
    <>
      {/* Mobile scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-label="Conversation history"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col overflow-hidden border-r border-paper-200 bg-paper-100/95 backdrop-blur-sm",
          "transition-[transform,width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "md:relative md:z-auto md:translate-x-0 md:bg-paper-100/60",
          isOpen
            ? "translate-x-0 shadow-drawer md:w-72 md:shadow-none"
            : "-translate-x-full md:w-0 md:border-r-0"
        )}
        inert={!isOpen}
      >
        <div className="flex w-72 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-14 items-center justify-between px-4">
            <Logo />
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              title="Close sidebar"
              className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-paper-200/60 hover:text-ink"
            >
              <X className="h-5 w-5 md:hidden" />
              <PanelLeftClose className="hidden h-5 w-5 md:block" />
            </button>
          </div>

          {/* New chat + search */}
          <div className="space-y-2 px-3 pb-3">
            <button
              onClick={onNewChat}
              className="group flex w-full items-center gap-2.5 rounded-xl border border-paper-200 bg-white px-3 py-2.5 text-sm font-medium text-ink shadow-paper transition-all hover:border-brand-light/60 hover:text-brand active:scale-[0.98]"
            >
              <SquarePen className="h-4 w-4 text-brand" />
              New conversation
              <kbd className="ml-auto hidden rounded border border-paper-200 bg-paper-50 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint md:inline">
                ⌘K
              </kbd>
            </button>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations"
                aria-label="Search conversations"
                className="w-full rounded-xl border border-transparent bg-paper-200/40 py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand-light/50 focus:bg-white"
              />
            </div>
          </div>

          {/* List */}
          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            {groups.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <MessageSquareText className="mx-auto mb-3 h-8 w-8 text-paper-300" />
                <p className="text-sm text-ink-muted">
                  {query ? "No matching conversations" : "No conversations yet"}
                </p>
                {!query && (
                  <p className="mt-1 text-xs text-ink-faint">
                    Your history will appear here.
                  </p>
                )}
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.label} className="mb-4">
                  <h3 className="px-3 pb-1.5 pt-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                    {group.label}
                  </h3>
                  <ul className="space-y-0.5">
                    {group.chats.map((chat) => {
                      const active = chat.id === currentChatId;
                      const confirming = pendingDelete === chat.id;
                      return (
                        <li key={chat.id} className="group/item relative">
                          <button
                            onClick={() => onSelectChat(chat.id)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "w-full truncate rounded-lg py-2 pl-3 pr-9 text-left text-sm transition-colors",
                              active
                                ? "bg-white font-medium text-ink shadow-paper"
                                : "text-ink-light/90 hover:bg-paper-200/50 hover:text-ink"
                            )}
                          >
                            {chat.title}
                          </button>

                          {confirming ? (
                            <div className="absolute inset-y-0 right-1 flex items-center gap-0.5 rounded-lg bg-white pl-2 shadow-paper">
                              <span className="pr-1 text-xs text-ink-muted">Delete?</span>
                              <button
                                onClick={() => {
                                  onDeleteChat(chat.id);
                                  setPendingDelete(null);
                                }}
                                aria-label="Confirm delete"
                                className="rounded p-1 text-red-600 hover:bg-red-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setPendingDelete(null)}
                                aria-label="Cancel delete"
                                className="rounded p-1 text-ink-muted hover:bg-paper-100"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setPendingDelete(chat.id)}
                              aria-label={`Delete “${chat.title}”`}
                              title="Delete"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-faint opacity-0 transition-opacity hover:bg-paper-100 hover:text-red-600 focus-visible:opacity-100 group-hover/item:opacity-100 max-md:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-paper-200 p-3">
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-light transition-colors hover:bg-paper-200/50 hover:text-ink"
            >
              <LogIn className="h-4 w-4" />
              Sign in to sync your history
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
