/**
 * Character Node
 *
 * Custom TipTap node for character names before dialogue.
 * Example: "JOHN"
 *
 * Styling: Centered, uppercase
 */

"use client";

export interface CharacterNodeProps {
  node: {
    attrs: {
      blockId: string;
    };
  };
}

export function CharacterNode({ node }: CharacterNodeProps) {
  return (
    <div
      className="character mt-4 mb-0 text-center font-mono text-sm uppercase"
      data-block-id={node.attrs.blockId}
    >
      {/* TODO: Use NodeViewWrapper and NodeViewContent from TipTap */}
      <span>CHARACTER NAME</span>
    </div>
  );
}

