"use client";

import React from "react";
import { Menu, Plus, MessageSquare, X } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: Chat[];
  currentChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  isOpen,
  onToggle,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-paper-200 shadow-drawer z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-paper-200">
          <h2 className="text-lg font-serif font-semibold text-ink">Chats</h2>
          <button
            onClick={onToggle}
            className="md:hidden p-2 hover:bg-paper-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-ink-faint" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2">
          {chats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-12 h-12 text-ink-faint mx-auto mb-3 opacity-50" />
              <p className="text-ink-faint text-sm">No chats yet</p>
              <p className="text-ink-faint text-xs mt-1">
                Start a new conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-1 pb-4">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`
                    w-full text-left px-3 py-3 rounded-lg transition-all
                    ${
                      currentChatId === chat.id
                        ? "bg-brand/10 border border-brand/20"
                        : "hover:bg-paper-50 border border-transparent"
                    }
                  `}
                >
                  <h3
                    className={`font-medium text-sm mb-1 truncate ${
                      currentChatId === chat.id ? "text-brand" : "text-ink"
                    }`}
                  >
                    {chat.title}
                  </h3>
                  {chat.lastMessage && (
                    <p className="text-xs text-ink-faint truncate">
                      {chat.lastMessage}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Toggle Button (visible when sidebar is closed on mobile) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-30 p-3 bg-white border border-paper-200 rounded-lg shadow-float hover:shadow-drawer transition-all md:hidden"
        >
          <Menu className="w-5 h-5 text-ink" />
        </button>
      )}
    </>
  );
}
