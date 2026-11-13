"use client";

import React from "react";
import { BookOpen, Code2, Lightbulb, PenLine } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: Lightbulb,
    title: "Brainstorm",
    prompt: "Give me 5 unconventional ideas for a weekend side project, with one sentence on why each is interesting.",
  },
  {
    icon: BookOpen,
    title: "Explain",
    prompt: "Explain how transformers work in machine learning as if I were a curious high-school student.",
  },
  {
    icon: Code2,
    title: "Code",
    prompt: "Write a TypeScript function that debounces another function, with a short usage example.",
  },
  {
    icon: PenLine,
    title: "Write",
    prompt: "Help me write a friendly, concise email asking my team to share feedback on a new design.",
  },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-2 text-center">
      <div className="mb-5 hidden h-12 w-12 items-center sm:flex justify-center rounded-2xl border border-paper-200 bg-white font-serif text-2xl font-bold italic text-brand shadow-paper">
        F
      </div>
      <h1
        className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        suppressHydrationWarning
      >
        {greeting()}.
      </h1>
      <p className="mt-2 text-base italic text-ink-muted sm:text-lg">
        What shall we think through today?
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map(({ icon: Icon, title, prompt }, i) => (
          <button
            key={title}
            onClick={() => onPick(prompt)}
            style={{ animationDelay: `${i * 50}ms` }}
            className="animate-message-in group flex items-start gap-3 rounded-xl border border-paper-200 bg-white/70 p-3.5 text-left shadow-paper transition-all hover:-translate-y-0.5 hover:border-brand-light/50 hover:bg-white hover:shadow-float focus-visible:outline-2 focus-visible:outline-brand-light"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-paper-100 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">{title}</span>
              <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-ink-muted">
                {prompt}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
