/**
 * StatusBar Component
 *
 * Bottom status bar showing document stats and cursor position.
 */

"use client";

export interface StatusBarProps {
  pageCount?: number;
  wordCount?: number;
  characterCount?: number;
  currentPage?: number;
  isSaving?: boolean;
  lastSaved?: Date;
}

export function StatusBar({
  pageCount = 0,
  wordCount = 0,
  characterCount = 0,
  currentPage = 1,
  isSaving = false,
  lastSaved,
}: StatusBarProps) {
  const formatLastSaved = () => {
    if (!lastSaved) return "Not saved";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  return (
    <footer className="flex items-center justify-between border-t bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground">
      {/* Left: Page info */}
      <div className="flex items-center gap-4">
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <span className="text-muted-foreground/50">|</span>
        <span>{wordCount.toLocaleString()} words</span>
        <span className="text-muted-foreground/50">|</span>
        <span>{characterCount.toLocaleString()} characters</span>
      </div>

      {/* Right: Save status */}
      <div className="flex items-center gap-2">
        {isSaving ? (
          <span className="animate-pulse">Saving...</span>
        ) : (
          <span>Saved {formatLastSaved()}</span>
        )}
      </div>
    </footer>
  );
}

