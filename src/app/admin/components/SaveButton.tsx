"use client";

import { useState } from "react";

interface SaveButtonProps {
  onClick: () => Promise<void>;
  label?: string;
  className?: string;
}

export default function SaveButton({ onClick, label = "Save Changes", className = "" }: SaveButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleClick = async () => {
    setState("saving");
    try {
      await onClick();
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch (err) {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const stateStyles = {
    idle: "bg-[#1e2a32] hover:bg-[#2d3f4a] text-white",
    saving: "bg-[#f5c80c] text-[#1e2a32] cursor-wait",
    saved: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  const stateLabels = {
    idle: label,
    saving: "Saving...",
    saved: "✓ Saved!",
    error: "✕ Error!",
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "saving"}
      className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] ${stateStyles[state]} ${className}`}
    >
      <span className="flex items-center gap-2 justify-center">
        {state === "saving" && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {stateLabels[state]}
      </span>
    </button>
  );
}
