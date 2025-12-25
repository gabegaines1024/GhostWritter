/**
 * useEditor Hook
 *
 * Initialize and manage the TipTap editor instance with
 * custom screenplay extensions.
 */

"use client";

import { useEditor as useTipTapEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { screenplayExtensions } from "../lib/tiptap/extensions";
import {
  handleSmartEnter,
  handleTabCycle,
} from "../lib/tiptap/input-rules";

export interface UseEditorOptions {
  initialContent?: string;
  onUpdate?: (content: string) => void;
  onSelectionUpdate?: (editor: Editor) => void;
  placeholder?: string;
}

export function useEditor(options: UseEditorOptions = {}) {
  const editor = useTipTapEditor({
    // Prevent SSR hydration mismatch in Next.js
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable nodes we don't need for screenplay
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        // Keep paragraph as fallback (some extensions depend on it)
      }),
      Placeholder.configure({
        placeholder: options.placeholder ?? "Start writing your screenplay...",
        emptyEditorClass: "is-editor-empty",
      }),
      ...screenplayExtensions,
    ],
    content: options.initialContent || getDefaultContent(),
    editorProps: {
      attributes: {
        class: "screenplay-editor-content outline-none",
      },
      handleKeyDown: (view, event) => {
        // Smart Enter key behavior
        if (event.key === "Enter" && !event.shiftKey) {
          const editor = (view as unknown as { editor: Editor }).editor;
          if (editor && handleSmartEnter(editor)) {
            return true;
          }
        }

        // Tab key cycling through block types
        if (event.key === "Tab") {
          event.preventDefault();
          const editor = (view as unknown as { editor: Editor }).editor;
          if (editor) {
            handleTabCycle(editor, event.shiftKey);
            return true;
          }
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      options.onUpdate?.(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      options.onSelectionUpdate?.(editor);
    },
  });

  return {
    editor,
    isReady: !!editor,
  };
}

/**
 * Get default content for a new screenplay
 */
function getDefaultContent() {
  return {
    type: "doc",
    content: [
      {
        type: "action",
        content: [{ type: "text", text: "" }],
      },
    ],
  };
}

/**
 * Commands to set block types (for toolbar integration)
 */
export function useEditorCommands(editor: Editor | null) {
  if (!editor) {
    return {
      setSceneHeading: () => {},
      setAction: () => {},
      setCharacter: () => {},
      setDialogue: () => {},
      setParenthetical: () => {},
      setTransition: () => {},
      setShot: () => {},
      getCurrentBlockType: () => null,
    };
  }

  return {
    setSceneHeading: () => editor.chain().focus().setNode("sceneHeading").run(),
    setAction: () => editor.chain().focus().setNode("action").run(),
    setCharacter: () => editor.chain().focus().setNode("character").run(),
    setDialogue: () => editor.chain().focus().setNode("dialogue").run(),
    setParenthetical: () => editor.chain().focus().setNode("parenthetical").run(),
    setTransition: () => editor.chain().focus().setNode("transition").run(),
    setShot: () => editor.chain().focus().setNode("shot").run(),
    getCurrentBlockType: () => {
      const { $from } = editor.state.selection;
      return $from.parent.type.name;
    },
  };
}
