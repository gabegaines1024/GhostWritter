/**
 * Script List Component
 *
 * Grid view of all user's scripts with create new option.
 */

"use client";

import type { Script } from "@/types/screenplay";

export interface ScriptListProps {
  scripts?: Script[];
  onScriptClick?: (scriptId: string) => void;
  onCreateNew?: () => void;
  isLoading?: boolean;
}

export function ScriptList({
  scripts = [],
  onScriptClick,
  onCreateNew,
  isLoading = false,
}: ScriptListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg border bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Create New Script Card */}
      <button
        onClick={onCreateNew}
        className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary hover:bg-muted/50"
      >
        <span className="text-4xl">+</span>
        <span className="text-sm font-medium">New Script</span>
      </button>

      {/* Script Cards */}
      {scripts.map((script) => (
        <button
          key={script._id}
          onClick={() => onScriptClick?.(script._id)}
          className="flex h-48 flex-col justify-between rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted/50"
        >
          <div>
            <h3 className="font-semibold">{script.title}</h3>
            <p className="text-sm text-muted-foreground">by {script.author}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {new Date(script.updatedAt).toLocaleDateString()}
          </div>
        </button>
      ))}
    </div>
  );
}

