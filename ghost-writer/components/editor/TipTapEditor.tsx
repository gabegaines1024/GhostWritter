/**
 * TipTap Editor Component
 *
 * Main screenplay editor powered by TipTap/ProseMirror.
 *
 * TODO: Implement after installing TipTap dependencies
 * npm install @tiptap/react @tiptap/starter-kit @tiptap/pm
 */

"use client";

// import { EditorContent } from "@tiptap/react";
// import { useEditor } from "@/hooks/useEditor";

export interface TipTapEditorProps {
  scriptId: string;
  initialContent?: string;
}

export function TipTapEditor({ scriptId }: TipTapEditorProps) {
  // TODO: Initialize editor with useEditor hook
  // const { editor } = useEditor({
  //   initialContent,
  //   onUpdate: (content) => {
  //     // Sync to Convex
  //   },
  // });

  return (
    <div className="screenplay-editor" data-script-id={scriptId}>
      {/* TODO: Add EditorContent from TipTap */}
      {/* <EditorContent editor={editor} /> */}
      <div className="p-8 text-muted-foreground">
        <p>TipTap Editor placeholder</p>
        <p className="text-sm">
          Install dependencies and implement custom screenplay nodes.
        </p>
      </div>
    </div>
  );
}

