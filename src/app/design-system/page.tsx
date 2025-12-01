import React from "react";
import { BackgroundBlobs } from "@/components/design-system/background-blobs";
import { Button } from "@/components/ui/button";
import {
  SystemMessage,
  UserMessage,
  ThinkingIndicator,
} from "@/components/design-system/message-bubble";
import { FloatingInput } from "@/components/design-system/floating-input";
import { ArtifactView } from "@/components/design-system/artifact-view";
import { Send } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="bg-paper-50 text-ink font-body min-h-screen relative overflow-x-hidden selection:bg-brand-light/30 selection:text-brand-dark">
      <BackgroundBlobs />

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* HEADER */}
        <header className="text-center space-y-6 border-b border-paper-200 pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-paper-100 border border-paper-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand"></span>
            <span className="text-brand font-mono text-xs font-medium tracking-widest uppercase">
              Journal System v2.2
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-ink tracking-tight">
            The Research Interface
          </h1>
          <p className="text-xl text-ink-light font-body italic max-w-2xl mx-auto">
            An elegant, paper-inspired design system optimized for scientific
            inquiry and long-form reading.
          </p>
        </header>

        {/* SECTION 1: COLOR PALETTE */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-brand-light text-sm">01.</span>
            <h2 className="text-3xl font-serif font-bold text-ink">
              Chromatics
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Paper Palette */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint border-b border-paper-200 pb-2">
                Paper
              </h3>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-paper-50 border border-paper-200 shadow-paper flex items-end p-2">
                  <span className="font-mono text-[10px] text-ink-faint">
                    50 (Main)
                  </span>
                </div>
                <div className="h-16 rounded-lg bg-paper-100 border border-paper-200 shadow-paper flex items-end p-2">
                  <span className="font-mono text-[10px] text-ink-faint">
                    100 (Sec)
                  </span>
                </div>
                <div className="h-16 rounded-lg bg-paper-200 flex items-end p-2">
                  <span className="font-mono text-[10px] text-ink-faint">
                    200 (Border)
                  </span>
                </div>
              </div>
            </div>

            {/* Ink Palette */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint border-b border-paper-200 pb-2">
                Ink
              </h3>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-ink shadow-float flex items-end p-2 text-white">
                  <span className="font-mono text-[10px] opacity-70">
                    DEFAULT
                  </span>
                </div>
                <div className="h-16 rounded-lg bg-ink-light shadow-paper flex items-end p-2 text-white">
                  <span className="font-mono text-[10px] opacity-70">
                    Light
                  </span>
                </div>
              </div>
            </div>

            {/* Brand (Indigo) */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint border-b border-paper-200 pb-2">
                Regal Indigo
              </h3>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-brand-dark shadow-float flex items-end p-2 text-white">
                  <span className="font-mono text-[10px] opacity-70">Dark</span>
                </div>
                <div className="h-16 rounded-lg bg-brand shadow-float flex items-end p-2 text-white">
                  <span className="font-mono text-[10px] opacity-70">
                    DEFAULT
                  </span>
                </div>
                <div className="h-16 rounded-lg bg-brand-light shadow-paper flex items-end p-2 text-white">
                  <span className="font-mono text-[10px] opacity-70">
                    Light
                  </span>
                </div>
              </div>
            </div>

            {/* Science (Bio-Teal) */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint border-b border-paper-200 pb-2">
                Bio-Teal
              </h3>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-science-dark shadow-float flex items-end p-2 text-white">
                  <span className="font-mono text-[10px] opacity-70">Dark</span>
                </div>
                <div className="h-16 rounded-lg bg-science shadow-float flex items-end p-2 text-white">
                  <span className="font-mono text-[10px] opacity-70">
                    DEFAULT
                  </span>
                </div>
                <div className="h-16 rounded-lg bg-science-light border border-science/20 shadow-paper flex items-end p-2 text-science-dark">
                  <span className="font-mono text-[10px] opacity-70">
                    Light
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TYPOGRAPHY */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-brand-light text-sm">02.</span>
            <h2 className="text-3xl font-serif font-bold text-ink">
              Typography
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 bg-white/60 backdrop-blur-sm p-10 rounded-xl border border-paper-200 shadow-paper">
            {/* Type Scale */}
            <div className="space-y-8">
              <div>
                <span className="block font-mono text-xs text-ink-faint mb-2">
                  Playfair Display / Serif
                </span>
                <h1 className="text-5xl font-serif font-bold text-ink leading-tight">
                  The Study of
                  <br />
                  <span className="text-brand italic">
                    Algorithmic Cognition
                  </span>
                </h1>
              </div>
              <div>
                <span className="block font-mono text-xs text-ink-faint mb-2">
                  Lora / Body
                </span>
                <p className="text-lg text-ink leading-relaxed">
                  The interface utilizes{" "}
                  <strong className="text-brand font-medium">
                    high-contrast serifs
                  </strong>{" "}
                  to evoke the authority of academic journals. The{" "}
                  {`"Warm Paper"`}
                  background reduces eye strain during prolonged analysis
                  sessions, mimicking the reflectance of natural parchment.
                </p>
              </div>
            </div>

            {/* Code & Mono */}
            <div className="space-y-4">
              <span className="block font-mono text-xs text-ink-faint">
                IBM Plex Mono / Code
              </span>
              <div className="bg-paper-100 rounded-lg border border-paper-200 p-6 overflow-x-auto shadow-inner">
                <pre className="font-mono text-sm text-ink-light">
                  <span className="text-brand font-bold">class</span>{" "}
                  <span className="text-science-dark">NeuralArchitect</span>:
                  {"\n"}{" "}
                  <span className="text-ink-faint">
                    {`"""Defines the core structure."""`}
                  </span>
                  {"\n"}
                  {"\n"} <span className="text-brand">def</span>{" "}
                  <span className="text-science-dark">__init__</span>(self,
                  layers):
                  {"\n"} self.layers = layers
                  {"\n"} self.active = <span className="text-brand">True</span>
                  {"\n"}
                  {"\n"} <span className="text-brand">def</span>{" "}
                  <span className="text-science-dark">compute</span>(self,
                  input_vec):
                  {"\n"}{" "}
                  <span className="text-ink-faint">
                    # Calculate tensor flow
                  </span>
                  {"\n"} return [x * <span className="text-brand">0.95</span>{" "}
                  for x in input_vec]
                </pre>
              </div>
              <p className="font-mono text-xs text-ink-light mt-2 border-l-2 border-science pl-3">
                &gt; System status: Operational
                <br />
                &gt; Memory usage: 14%
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: BUTTONS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-brand-light text-sm">03.</span>
            <h2 className="text-3xl font-serif font-bold text-ink">Controls</h2>
          </div>
          <div className="flex flex-wrap gap-6 items-center p-10 bg-paper-50 rounded-xl border border-paper-200 shadow-paper">
            {/* Primary Button */}
            <Button>Start Analysis</Button>

            {/* Secondary Button */}
            <Button variant="secondary">Review Literature</Button>

            {/* Accent Button */}
            <Button variant="accent">Export_Data.csv</Button>

            {/* Icon/Ghost */}
            <Button variant="ghost" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* SECTION 4: MESSAGE MODULES */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-brand-light text-sm">04.</span>
            <h2 className="text-3xl font-serif font-bold text-ink">
              Message Modules
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Message Component */}
            <div className="bg-paper-50 border border-paper-200 p-8 rounded-xl shadow-paper space-y-4">
              <h3 className="font-mono text-xs uppercase text-ink-faint tracking-widest">
                System Response (No Avatar)
              </h3>
              <div className="flex items-start gap-4">
                <SystemMessage>
                  The analysis is complete. Proceeding with data visualization.
                </SystemMessage>
              </div>
            </div>

            {/* User Message Component */}
            <div className="bg-paper-50 border border-paper-200 p-8 rounded-xl shadow-paper space-y-4">
              <h3 className="font-mono text-xs uppercase text-ink-faint tracking-widest">
                User Query (No Avatar)
              </h3>
              <div className="flex justify-end">
                <UserMessage>
                  Highlight the variances in the Q3 dataset.
                </UserMessage>
              </div>
            </div>

            {/* Thinking Component */}
            <div className="bg-paper-50 border border-paper-200 p-8 rounded-xl shadow-paper space-y-4 md:col-span-2">
              <h3 className="font-mono text-xs uppercase text-ink-faint tracking-widest">
                System Reasoning (Thinking State)
              </h3>
              <div className="flex justify-start">
                <ThinkingIndicator />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INPUT MECHANISMS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-brand-light text-sm">05.</span>
            <h2 className="text-3xl font-serif font-bold text-ink">
              Input Mechanisms
            </h2>
          </div>

          <div className="bg-paper-50 border border-paper-200 p-10 rounded-xl shadow-paper">
            <h3 className="font-mono text-xs uppercase text-ink-faint tracking-widest mb-6">
              Floating Paper Input
            </h3>
            <FloatingInput />
          </div>
        </section>

        {/* SECTION 6: ARTIFACT VIEWS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-brand-light text-sm">06.</span>
            <h2 className="text-3xl font-serif font-bold text-ink">
              Artifact Canvas
            </h2>
          </div>

          <div className="bg-white border border-paper-200 p-8 rounded-xl shadow-paper grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-ink">
                The Digital Slide
              </h3>
              <p className="text-ink-light leading-relaxed">
                Artifacts (HTML/React/Python output) are rendered in a distinct
                card that mimics a microscope slide or a printed figure in a
                journal. The header provides immediate context (filename) and
                toggle controls.
              </p>
            </div>

            <ArtifactView />
          </div>
        </section>

        {/* SECTION 7: CHAT INTERFACE (Integrated Workspace) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-brand-light text-sm">07.</span>
            <h2 className="text-3xl font-serif font-bold text-ink">
              The Workspace
            </h2>
          </div>

          {/* DEVICE CONTAINER */}
          <div className="relative w-full max-w-5xl mx-auto h-[850px] bg-white border border-paper-200 rounded-xl shadow-float overflow-hidden flex flex-row">
            {/* SIDEBAR */}
            <div className="w-72 bg-paper-50 border-r border-paper-200 flex flex-col hidden md:flex">
              <div className="h-20 flex items-center px-6 border-b border-paper-200">
                <button className="w-full bg-white hover:bg-paper-50 text-brand font-serif font-bold py-2 px-4 rounded-md border border-paper-200 flex items-center justify-center gap-2 transition-all shadow-paper">
                  <span className="font-serif italic">New Inquiry</span>
                  <span className="text-xl leading-none">+</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-8">
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-ink-faint uppercase tracking-widest mb-4 px-2">
                    Current Session
                  </h4>
                  <div className="space-y-1">
                    <div className="p-3 bg-white rounded-md cursor-pointer border-l-2 border-brand shadow-paper">
                      <p className="text-sm font-serif font-medium text-ink truncate">
                        Variance Heatmap
                      </p>
                      <p className="text-[10px] text-ink-light font-mono mt-1">
                        10:42 AM
                      </p>
                    </div>
                    <div className="p-3 hover:bg-paper-100 rounded-md cursor-pointer text-ink-light transition-colors">
                      <p className="text-sm font-serif truncate">
                        Hypothesis Gen. 4
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-ink-faint uppercase tracking-widest mb-4 px-2">
                    Archives
                  </h4>
                  <div className="space-y-1">
                    <div className="p-3 hover:bg-paper-100 rounded-md cursor-pointer text-ink-light transition-colors group">
                      <p className="text-sm font-serif truncate group-hover:text-ink">
                        Q3 Migration Logs
                      </p>
                    </div>
                    <div className="p-3 hover:bg-paper-100 rounded-md cursor-pointer text-ink-light transition-colors group">
                      <p className="text-sm font-serif truncate group-hover:text-ink">
                        Experiment #204
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-paper-200 bg-paper-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand text-white font-serif italic text-lg flex items-center justify-center border-2 border-paper-50 shadow-sm">
                    J
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-ink font-serif truncate">
                      Dr. J. Doe
                    </p>
                    <p className="text-xs text-ink-light font-mono truncate">
                      Lead Author
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col relative bg-white">
              {/* Mock Header */}
              <div className="h-20 bg-white/90 backdrop-blur-sm border-b border-paper-200 flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  {/* Header Avatar removed/simplified to icon */}
                  <div className="w-10 h-10 rounded-full bg-paper-100 border border-paper-300 flex items-center justify-center text-brand font-serif font-bold text-xl shadow-inner">
                    N
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-ink text-lg leading-tight">
                      Nexus Assistant
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-science animate-pulse"></span>
                      <p className="text-[10px] text-ink-light font-mono tracking-wide uppercase">
                        System Active
                      </p>
                    </div>
                  </div>
                </div>
                <button className="text-paper-300 hover:text-brand transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>

              {/* Chat Content Stream */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth pb-32">
                <div className="flex items-center justify-center">
                  <span className="bg-paper-100 px-3 py-1 rounded-full text-[10px] font-mono text-ink-faint border border-paper-200">
                    Session Started: Oct 24
                  </span>
                </div>

                {/* AI Message (Avatar Removed) */}
                <div className="flex items-start gap-4 max-w-3xl">
                  <SystemMessage>
                    Greetings, Doctor. I have reviewed your latest datasets.
                    Shall we proceed with the visual reconstruction of the
                    variance data?
                  </SystemMessage>
                </div>

                {/* User Message (No Avatar) */}
                <div className="flex items-start gap-4 max-w-3xl ml-auto flex-row-reverse">
                  <UserMessage>
                    Yes, please. Specifically, I need a heatmap visualization
                    for the Q3 variance. Highlight the anomalies in Bio-Teal.
                  </UserMessage>
                  <div className="text-right self-end">
                    <span className="text-[10px] font-mono text-ink-faint">
                      10:44 AM
                    </span>
                  </div>
                </div>

                {/* AI Response with Canvas (Avatar Removed) */}
                <div className="flex items-start gap-4 max-w-3xl w-full">
                  <div className="space-y-3 w-full">
                    <SystemMessage className="w-full">
                      <p className="mb-4">
                        I have generated the component. You may inspect the
                        render below.
                      </p>
                      {/* CANVAS COMPONENT MOCK */}
                      <div className="mt-2 bg-paper-50 rounded-lg border border-paper-200 overflow-hidden shadow-inner">
                        <div className="bg-white border-b border-paper-200 px-4 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Maximize2 className="w-3.5 h-3.5 text-science" />
                            <span className="text-xs font-mono text-ink-light">
                              fig_1_heatmap.html
                            </span>
                          </div>
                          <div className="flex bg-paper-100 rounded p-0.5 border border-paper-200">
                            <button className="px-3 py-0.5 text-[10px] font-bold rounded-sm bg-white text-ink shadow-sm border border-paper-200">
                              Preview
                            </button>
                            <button className="px-3 py-0.5 text-[10px] font-bold rounded-sm text-ink-faint hover:text-ink">
                              Code
                            </button>
                          </div>
                        </div>
                        <div className="h-64 bg-white flex items-center justify-center p-8 relative overflow-hidden">
                          <div className="grid grid-cols-5 gap-0.5 w-64 h-48 opacity-90">
                            <div className="bg-paper-200"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-science-light"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-science/20"></div>
                            <div className="bg-science"></div>
                            <div className="bg-science/40"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-science/40"></div>
                            <div className="bg-science-dark"></div>
                            <div className="bg-science/60"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-paper-200"></div>
                            <div className="bg-science/10"></div>
                            <div className="bg-science/50"></div>
                            <div className="bg-science/20"></div>
                            <div className="bg-paper-200"></div>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white/90 border border-paper-200 px-2 py-1 rounded shadow-sm">
                            <p className="font-mono text-[8px] text-ink-faint uppercase">
                              Figure 1.2
                            </p>
                          </div>
                        </div>
                      </div>
                    </SystemMessage>
                  </div>
                </div>

                {/* LIVE THINKING EXAMPLE (New) */}
                <div className="flex items-start gap-4 max-w-3xl">
                  <div className="bg-paper-100/50 border border-paper-200 p-4 rounded-xl inline-flex items-center gap-3 shadow-inner">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-[bounce_1s_infinite]"></span>
                      <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                      <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                    </div>
                    <span className="font-mono text-xs font-medium text-ink-light tracking-wide uppercase animate-pulse">
                      Validating references...
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Area (Floating Paper) */}
              <div className="absolute bottom-6 left-0 right-0 px-8 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                  <FloatingInput />
                  <div className="text-center mt-3">
                    <span className="text-[10px] text-ink-faint font-mono tracking-widest uppercase">
                      Research Assistant v2.0 // Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Maximize2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
