/**
 * Dialogue Node
 *
 * Custom TipTap node for character dialogue.
 * Example: "I can't believe you're here."
 *
 * Styling: Indented from both sides (screenplay standard margins)
 */

"use client";

export interface DialogueNodeProps {
  node: {
    attrs: {
      blockId: string;
    };
  };
}

export function DialogueNode({ node }: DialogueNodeProps) {
  return (
    <div
      className="dialogue mx-auto mb-2 max-w-md font-mono text-sm"
      data-block-id={node.attrs.blockId}
    >
      {/* TODO: Use NodeViewWrapper and NodeViewContent from TipTap */}
      <span>Dialogue placeholder text goes here.</span>
    </div>
  );
}

