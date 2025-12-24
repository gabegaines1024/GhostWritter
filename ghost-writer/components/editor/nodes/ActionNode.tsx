/**
 * Action Node
 *
 * Custom TipTap node for screenplay action/description blocks.
 * Example: "The door swings open. JOHN enters, looking exhausted."
 *
 * Styling: Standard paragraph, full width
 */

"use client";

export interface ActionNodeProps {
  node: {
    attrs: {
      blockId: string;
    };
  };
}

export function ActionNode({ node }: ActionNodeProps) {
  return (
    <div
      className="action my-2 font-mono text-sm"
      data-block-id={node.attrs.blockId}
    >
      {/* TODO: Use NodeViewWrapper and NodeViewContent from TipTap */}
      <span>Action block placeholder text.</span>
    </div>
  );
}

