/**
 * Script Editor Client Component
 *
 * MonkeyType-inspired editor layout - dark, minimal, focused.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TipTapEditor } from "../../../components/editor/TipTapEditor";
import type { BlockType } from "../../../types/screenplay";
import type { Id } from "../../../convex/_generated/dataModel";

interface ScriptEditorClientProps {
  scriptId: string;
}

const BLOCK_TYPES: Array<{ type: BlockType; label: string; shortcut: string }> = [
  { type: "sceneHeading", label: "Scene", shortcut: "1" },
  { type: "action", label: "Action", shortcut: "2" },
  { type: "character", label: "Character", shortcut: "3" },
  { type: "dialogue", label: "Dialogue", shortcut: "4" },
  { type: "parenthetical", label: "Paren", shortcut: "5" },
  { type: "transition", label: "Trans", shortcut: "6" },
];

export function ScriptEditorClient({ scriptId }: ScriptEditorClientProps) {
  const router = useRouter();
  const [activeBlockType, setActiveBlockType] = useState<BlockType>("action");
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Fetch script details
  const script = useQuery(api.scripts.get, {
    scriptId: scriptId as Id<"scripts">,
  });

  // Fetch blocks for scene list
  const blocks = useQuery(api.scriptBlocks.getByScript, {
    scriptId: scriptId as Id<"scripts">,
  });

  // Extract scenes from blocks
  const scenes = blocks
    ?.filter((block) => block.type === "sceneHeading")
    .map((block, index) => ({
      id: block._id,
      number: index + 1,
      heading: block.content || "Untitled Scene",
      blockId: block.blockId,
    })) ?? [];

  const handleBlockTypeChange = (type: BlockType) => {
    setActiveBlockType(type);
  };

  const handleToolbarTypeChange = (type: BlockType) => {
    // TODO: Command editor to change block type
    console.log("Change to:", type);
  };

  const handleSceneClick = (blockId: string) => {
    // TODO: Scroll to block in editor
    console.log("Navigate to:", blockId);
  };

  const pageCount = Math.max(1, Math.ceil(wordCount / 250));

  return (
    <div className="editor-layout">
      {/* Sidebar */}
      <aside className="editor-sidebar">
        <div className="editor-sidebar-header">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span>←</span>
            <span className="ghost-logo text-base">
              <span className="ghost-logo-accent">ghost</span>writer
            </span>
          </button>
        </div>

        <div className="editor-sidebar-content">
          <div className="editor-sidebar-title mb-4">Scenes</div>

          {scenes.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] px-3">
              No scenes yet. Type "INT." or "EXT." to create one.
            </p>
          ) : (
            <div className="scene-list">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => handleSceneClick(scene.blockId)}
                  className="scene-item"
                >
                  <span className="scene-item-number">{scene.number}</span>
                  <span className="scene-item-heading">{scene.heading}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="editor-sidebar-footer">
          <div className="flex items-center justify-between">
            <span>{scenes.length} scenes</span>
            <span>{pageCount} pages</span>
          </div>
        </div>
      </aside>

      {/* Main Editor */}
      <div className="editor-main">
        {/* Toolbar */}
        <div className="editor-toolbar">
          <div className="editor-toolbar-title">
            {script?.title ?? "Loading..."}
          </div>

          <div className="editor-toolbar-actions">
            {BLOCK_TYPES.map(({ type, label, shortcut }) => (
              <button
                key={type}
                onClick={() => handleToolbarTypeChange(type)}
                className={`editor-toolbar-btn ${activeBlockType === type ? "active" : ""}`}
                title={`${label} (⌘${shortcut})`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Content */}
        <div className="editor-content">
          <TipTapEditor
            scriptId={scriptId}
            onBlockTypeChange={handleBlockTypeChange}
          />
        </div>

        {/* Status Bar */}
        <div className="editor-statusbar">
          <div className="editor-statusbar-item">
            <span
              className={`editor-statusbar-dot ${isSaving ? "saving" : ""}`}
            />
            <span>{isSaving ? "saving" : "saved"}</span>
          </div>

          <div className="flex items-center gap-6">
            <span>page {pageCount}</span>
            <span>{wordCount} words</span>
            <span className="text-[var(--accent-primary)]">
              {activeBlockType}
            </span>
          </div>

          <div className="editor-statusbar-item">
            <kbd className="kbd text-[10px]">tab</kbd>
            <span className="text-[var(--text-muted)]">cycle type</span>
          </div>
        </div>
      </div>
    </div>
  );
}
