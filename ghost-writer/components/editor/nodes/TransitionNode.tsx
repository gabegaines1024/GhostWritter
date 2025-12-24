/**
 * Transition Node
 *
 * Custom TipTap node for scene transitions.
 * Example: "CUT TO:", "FADE OUT."
 *
 * Styling: Right-aligned, uppercase
 */

"use client";

export interface TransitionNodeProps {
  node: {
    attrs: {
      blockId: string;
    };
  };
}

export function TransitionNode({ node }: TransitionNodeProps) {
  return (
    <div
      className="transition my-4 text-right font-mono text-sm uppercase"
      data-block-id={node.attrs.blockId}
    >
      {/* TODO: Use NodeViewWrapper and NodeViewContent from TipTap */}
      <span>CUT TO:</span>
    </div>
  );
}

