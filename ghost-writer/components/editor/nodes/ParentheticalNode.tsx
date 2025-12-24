/**
 * Parenthetical Node
 *
 * Custom TipTap node for actor direction within dialogue.
 * Example: "(sighing)"
 *
 * Styling: Centered, smaller text, in parentheses
 */

"use client";

export interface ParentheticalNodeProps {
  node: {
    attrs: {
      blockId: string;
    };
  };
}

export function ParentheticalNode({ node }: ParentheticalNodeProps) {
  return (
    <div
      className="parenthetical mx-auto mb-1 max-w-xs text-center font-mono text-xs italic"
      data-block-id={node.attrs.blockId}
    >
      {/* TODO: Use NodeViewWrapper and NodeViewContent from TipTap */}
      <span>(parenthetical)</span>
    </div>
  );
}

