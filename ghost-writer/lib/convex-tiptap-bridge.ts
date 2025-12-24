/**
 * Convex ↔ TipTap Bridge
 *
 * Conversion utilities for transforming data between Convex documents
 * and TipTap editor nodes.
 */

import type { ScriptBlock, BlockType, TipTapNode } from "../types/screenplay";

/**
 * Convert a Convex ScriptBlock to a TipTap node
 */
export function convexBlockToTipTap(block: ScriptBlock): TipTapNode {
  return {
    type: block.type,
    attrs: {
      blockId: block.blockId,
      type: block.type,
    },
    content: block.content ? [{ type: "text", text: block.content }] : [],
  };
}

/**
 * Convert multiple Convex blocks to a TipTap document structure
 */
export function convexBlocksToTipTapDoc(blocks: ScriptBlock[]): {
  type: "doc";
  content: TipTapNode[];
} {
  // Sort blocks by order before converting
  const sortedBlocks = [...blocks].sort((a, b) =>
    a.order.localeCompare(b.order)
  );

  return {
    type: "doc",
    content: sortedBlocks.map(convexBlockToTipTap),
  };
}

/**
 * Extract block data from a TipTap node for Convex mutation
 */
export function tipTapNodeToConvexBlock(
  node: TipTapNode,
  scriptId: string,
  order: string
): Omit<ScriptBlock, "_id"> {
  const textContent = node.content
    ?.filter((child: { type: string; text: string }) => child.type === "text")
    .map((child: { type: string; text: string }) => child.text)
    .join("") ?? "";

  return {
    scriptId,
    blockId: node.attrs.blockId,
    type: node.attrs.type as BlockType,
    content: textContent,
    order,
  };
}

/**
 * Get the text content from a TipTap node
 */
export function getNodeTextContent(node: TipTapNode): string {
  return (
    node.content
      ?.filter((child: { type: string; text: string }) => child.type === "text")
      .map((child: { type: string; text: string }) => child.text)
      .join("") ?? ""
  );
}

