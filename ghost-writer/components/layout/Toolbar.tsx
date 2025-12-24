/**
 * Toolbar Component
 *
 * Top toolbar with screenplay-specific formatting actions.
 */

"use client";

import type { BlockType } from "@/types/screenplay";

export interface ToolbarProps {
  scriptTitle?: string;
  activeBlockType?: BlockType;
  onBlockTypeChange?: (type: BlockType) => void;
  onSave?: () => void;
}

const BLOCK_TYPES: Array<{ type: BlockType; label: string; shortcut: string }> =
  [
    { type: "sceneHeading", label: "Scene", shortcut: "⌘1" },
    { type: "action", label: "Action", shortcut: "⌘2" },
    { type: "character", label: "Character", shortcut: "⌘3" },
    { type: "dialogue", label: "Dialogue", shortcut: "⌘4" },
    { type: "parenthetical", label: "Paren", shortcut: "⌘5" },
    { type: "transition", label: "Transition", shortcut: "⌘6" },
  ];

export function Toolbar({
  scriptTitle = "Untitled Script",
  activeBlockType,
  onBlockTypeChange,
  onSave,
}: ToolbarProps) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-2">
      {/* Left: Script Title */}
      <div>
        <h1 className="text-lg font-semibold">{scriptTitle}</h1>
      </div>

      {/* Center: Block Type Buttons */}
      <div className="flex items-center gap-1">
        {BLOCK_TYPES.map(({ type, label, shortcut }) => (
          <button
            key={type}
            onClick={() => onBlockTypeChange?.(type)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              activeBlockType === type
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
            title={`${label} (${shortcut})`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Save
        </button>
      </div>
    </header>
  );
}

