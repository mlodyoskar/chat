import React from "react";

export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Indigo Blob */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-brand-light/10 rounded-full blur-[80px] animate-float"></div>
      {/* Paper/Warm Blob */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-paper-200/40 rounded-full blur-[100px] animate-float-delayed"></div>
      {/* Bio-Teal Blob */}
      <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-science-light/40 rounded-full blur-[90px] animate-float"></div>
    </div>
  );
}
