import React from "react";
import { Maximize2, Code } from "lucide-react";

export function ArtifactView() {
  return (
    <div className="bg-paper-50 rounded-lg border border-paper-200 overflow-hidden shadow-inner">
      {/* Canvas Header */}
      <div className="bg-white border-b border-paper-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-3.5 h-3.5 text-science" />
          <span className="text-xs font-mono text-ink-light">
            figure_view.html
          </span>
        </div>
        {/* Toggle */}
        <div className="flex bg-paper-100 rounded p-0.5 border border-paper-200">
          <button className="px-3 py-0.5 text-[10px] font-bold rounded-sm bg-white text-ink shadow-sm border border-paper-200">
            Preview
          </button>
          <button className="px-3 py-0.5 text-[10px] font-bold rounded-sm text-ink-faint hover:text-ink">
            Code
          </button>
        </div>
      </div>

      {/* Canvas Body Mock */}
      <div className="h-48 bg-white flex items-center justify-center p-8 relative overflow-hidden">
        <div className="text-center">
          <div className="inline-block w-12 h-12 bg-science/10 rounded-full flex items-center justify-center text-science mb-2 mx-auto">
            <Code className="w-6 h-6" />
          </div>
          <p className="font-serif italic text-sm text-ink-light">
            Live Content Render
          </p>
        </div>
      </div>
    </div>
  );
}
