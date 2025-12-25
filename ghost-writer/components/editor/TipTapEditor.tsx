/**
 * TipTap Editor Component
 *
 * Main screenplay editor with MonkeyType-inspired styling.
 */

"use client";

import { EditorContent } from "@tiptap/react";
import { useEditor, useEditorCommands } from "../../hooks/useEditor";
import { useEditorSync } from "../../hooks/useEditorSync";
import type { BlockType } from "../../types/screenplay";

export interface TipTapEditorProps {
  scriptId: string;
  initialContent?: string;
  onBlockTypeChange?: (type: BlockType) => void;
}

export function TipTapEditor({
  scriptId,
  initialContent,
  onBlockTypeChange,
}: TipTapEditorProps) {
  const { editor, isReady } = useEditor({
    initialContent,
    placeholder: "Start writing... (type INT. or EXT. for a scene heading)",
    onUpdate: () => {
      // Content updates handled by useEditorSync
    },
    onSelectionUpdate: (editor) => {
      const { $from } = editor.state.selection;
      const blockType = $from.parent.type.name as BlockType;
      onBlockTypeChange?.(blockType);
    },
  });

  const commands = useEditorCommands(editor);

  const { blocks, isLoading, isSaving, lastSaved, debouncedSaveContent } =
    useEditorSync({
      scriptId,
      editor,
    });

  // Loading state
  if (!isReady) {
    return (
      <div className="screenplay-editor-wrapper flex items-center justify-center">
        <div className="text-[var(--text-muted)] animate-pulse">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="screenplay-editor h-full" data-script-id={scriptId}>
      <EditorContent
        editor={editor}
        className="screenplay-editor-wrapper"
      />
    </div>
  );
}

/**
 * Standalone editor without Convex (for testing)
 */
export function TipTapEditorStandalone({
  initialContent,
  onChange,
}: {
  initialContent?: string;
  onChange?: (content: string) => void;
}) {
  const { editor, isReady } = useEditor({
    initialContent,
    onUpdate: onChange,
  });

  if (!isReady) {
    return (
      <div className="screenplay-editor-wrapper text-[var(--text-muted)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="screenplay-editor h-full">
      <EditorContent editor={editor} className="screenplay-editor-wrapper" />
    </div>
  );
}
