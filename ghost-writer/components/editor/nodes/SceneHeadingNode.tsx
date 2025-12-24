/**
 * Scene Heading Node
 *
 * Custom TipTap node for screenplay scene headings.
 * Example: "INT. COFFEE SHOP - DAY"
 *
 * Styling: All caps, bold
 */

"use client";

// import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export interface SceneHeadingNodeProps {
  node: {
    attrs: {
      blockId: string;
    };
  };
}

export function SceneHeadingNode({ node }: SceneHeadingNodeProps) {
  return (
    <div
      className="scene-heading my-4 font-mono text-sm font-bold uppercase"
      data-block-id={node.attrs.blockId}
    >
      {/* TODO: Use NodeViewWrapper and NodeViewContent from TipTap */}
      {/* <NodeViewWrapper>
        <NodeViewContent className="outline-none" />
      </NodeViewWrapper> */}
      <span>INT. SCENE HEADING PLACEHOLDER - DAY</span>
    </div>
  );
}

/**
 * TipTap Extension for Scene Heading
 *
 * TODO: Create and export the extension
 *
 * export const SceneHeadingExtension = Node.create({
 *   name: 'sceneHeading',
 *   group: 'block',
 *   content: 'text*',
 *   addAttributes() {
 *     return {
 *       blockId: { default: '' },
 *     };
 *   },
 *   addNodeView() {
 *     return ReactNodeViewRenderer(SceneHeadingNode);
 *   },
 * });
 */

