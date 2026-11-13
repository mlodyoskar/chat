/**
 * Canned replies used when no OPENROUTER_API_KEY is configured (or MOCK_CHAT=1).
 * The reply is picked from keywords in the last user message so every part of
 * the UI — code blocks, tables, lists, long answers, errors — can be tried locally.
 */

export type MockReply = { kind: "text"; text: string } | { kind: "error"; status: number; message: string };

const CODE = `Here's a small, typed debounce helper:

\`\`\`ts
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait = 300
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
\`\`\`

**Usage**

\`\`\`ts
const save = debounce((text: string) => api.save(text), 500);
input.addEventListener("input", (e) => save((e.target as HTMLInputElement).value));
\`\`\`

The call only fires once the user stops typing for \`wait\` milliseconds. Use the **Copy** button on a block to grab it.`;

const TABLE = `A quick comparison of common state-management options:

| Library | Bundle size | Learning curve | Best for |
| --- | --- | --- | --- |
| React state | 0 kB | Low | Local UI state |
| Zustand | ~1 kB | Low | Small–medium apps |
| Redux Toolkit | ~12 kB | Medium | Large teams, devtools |
| Jotai | ~3 kB | Low | Atomic, derived state |

> Rule of thumb: start with React state and reach for a library only when prop-drilling hurts.`;

const BRAINSTORM = `Here are five unconventional weekend projects:

1. **A plant that tweets when it's thirsty** — a soil sensor, a microcontroller and a tiny API. Surprisingly delightful.
2. **Personal "museum" of your photos** — generate wall labels for old pictures with dates, places and a short story.
3. **Neighbourhood sound map** — record 10-second clips around your street and pin them on a map.
4. **Recipe diff tool** — show two versions of a recipe like a code diff, to see what actually changed.
5. **One-button journal** — a single physical button that logs "good moment" timestamps; review them on Sunday.

Want me to sketch a plan for any of these?`;

const EXPLAIN = `## Transformers, simply

Imagine reading a sentence and, for every word, asking: *"which other words should I pay attention to, to understand this one?"* That's **attention**.

### The three steps

1. **Turn words into numbers.** Each word becomes a list of numbers (an *embedding*) that captures its meaning.
2. **Let words look at each other.** For every word, the model scores how relevant every other word is, then blends their information together. In *"The cat sat because **it** was tired"*, "it" learns to look strongly at "cat".
3. **Repeat in layers.** Stacking many attention layers lets the model build up from grammar to facts to reasoning.

### Why it was a breakthrough

- It processes all words **in parallel**, so it trains fast on GPUs.
- It handles **long-range connections** that older models forgot.

---

To generate text, a transformer just predicts the most likely next word, appends it, and repeats — which is exactly what's happening as this reply streams in.`;

const EMAIL = `Here's a friendly, concise draft:

**Subject:** Quick favour — feedback on the new design 🙏

Hi team,

I've put together a first pass at the new design and would love your eyes on it before we go further. It should take about 10 minutes:

- **Link:** [Design draft](https://example.com)
- **What I'm looking for:** anything confusing, missing, or that just feels off
- **By when:** end of day Thursday

No need for polish — quick, honest notes are perfect. Thanks so much!

Best,
*Your name*`;

const HELP = `**You're chatting with Folio in mock mode.** No \`OPENROUTER_API_KEY\` is set, so replies are canned — but the whole interface is real.

Try messages containing these words to see different kinds of reply:

| Type this | You'll get |
| --- | --- |
| \`code\` or \`function\` | Syntax-highlighted code blocks with copy buttons |
| \`table\` or \`compare\` | A markdown table |
| \`idea\` or \`brainstorm\` | A numbered list |
| \`explain\` | A long, structured answer (good for testing scroll) |
| \`email\` or \`write\` | A drafted email |
| \`error\` | A failed request, to see the retry flow |
| \`slow\` | A very slow reply — try **Stop** or **Esc** |

Other things to try: **⌘K** new chat, **⌘\\\\** toggle sidebar, **/** focus the composer, search and delete in the sidebar, and refresh the page — your history stays.

To use a real model, add \`OPENROUTER_API_KEY=sk-or-...\` to \`.env.local\`.`;

export function pickMockReply(lastUserMessage: string): MockReply & { delayMs: number } {
  const t = lastUserMessage.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (has("error", "fail")) {
    return {
      kind: "error",
      status: 429,
      message: "The model is rate-limited right now (mock error). Press “Try again”.",
      delayMs: 0,
    };
  }
  if (has("slow")) return { kind: "text", text: EXPLAIN, delayMs: 120 };
  if (has("code", "function", "typescript", "debounce")) return { kind: "text", text: CODE, delayMs: 14 };
  if (has("table", "compare", "vs")) return { kind: "text", text: TABLE, delayMs: 16 };
  if (has("idea", "brainstorm", "project")) return { kind: "text", text: BRAINSTORM, delayMs: 18 };
  if (has("explain", "how", "why", "what is")) return { kind: "text", text: EXPLAIN, delayMs: 14 };
  if (has("email", "write", "draft")) return { kind: "text", text: EMAIL, delayMs: 16 };
  return { kind: "text", text: HELP, delayMs: 12 };
}
