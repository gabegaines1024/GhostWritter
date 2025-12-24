/**
 * Script Blocks CRUD Operations
 *
 * Mutations and queries for managing individual screenplay elements.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Block type validator
const blockType = v.union(
  v.literal("sceneHeading"),
  v.literal("action"),
  v.literal("character"),
  v.literal("dialogue"),
  v.literal("parenthetical"),
  v.literal("transition"),
  v.literal("shot")
);

/**
 * Get all blocks for a script, ordered by fractional index
 */
export const getByScript = query({
  args: { scriptId: v.id("scripts") },
  handler: async (ctx, args) => {
    const blocks = await ctx.db
      .query("scriptBlocks")
      .withIndex("by_script", (q) => q.eq("scriptId", args.scriptId))
      .collect();

    // Sort by fractional order
    return blocks.sort((a, b) => a.order.localeCompare(b.order));
  },
});

/**
 * Create a new block
 */
export const create = mutation({
  args: {
    scriptId: v.id("scripts"),
    blockId: v.string(),
    type: blockType,
    content: v.string(),
    order: v.string(),
    metadata: v.optional(
      v.object({
        characterName: v.optional(v.string()),
        sceneNumber: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const blockDocId = await ctx.db.insert("scriptBlocks", args);

    // Update script's updatedAt timestamp
    await ctx.db.patch(args.scriptId, { updatedAt: Date.now() });

    return blockDocId;
  },
});

/**
 * Update a block's content
 */
export const updateContent = mutation({
  args: {
    blockDocId: v.id("scriptBlocks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const block = await ctx.db.get(args.blockDocId);
    if (!block) throw new Error("Block not found");

    await ctx.db.patch(args.blockDocId, { content: args.content });

    // Update script's updatedAt timestamp
    await ctx.db.patch(block.scriptId, { updatedAt: Date.now() });
  },
});

/**
 * Change a block's type
 */
export const changeType = mutation({
  args: {
    blockDocId: v.id("scriptBlocks"),
    type: blockType,
  },
  handler: async (ctx, args) => {
    const block = await ctx.db.get(args.blockDocId);
    if (!block) throw new Error("Block not found");

    await ctx.db.patch(args.blockDocId, { type: args.type });

    // Update script's updatedAt timestamp
    await ctx.db.patch(block.scriptId, { updatedAt: Date.now() });
  },
});

/**
 * Move a block to a new position (update its order)
 */
export const move = mutation({
  args: {
    blockDocId: v.id("scriptBlocks"),
    newOrder: v.string(),
  },
  handler: async (ctx, args) => {
    const block = await ctx.db.get(args.blockDocId);
    if (!block) throw new Error("Block not found");

    await ctx.db.patch(args.blockDocId, { order: args.newOrder });

    // Update script's updatedAt timestamp
    await ctx.db.patch(block.scriptId, { updatedAt: Date.now() });
  },
});

/**
 * Delete a block
 */
export const remove = mutation({
  args: { blockDocId: v.id("scriptBlocks") },
  handler: async (ctx, args) => {
    const block = await ctx.db.get(args.blockDocId);
    if (!block) throw new Error("Block not found");

    await ctx.db.delete(args.blockDocId);

    // Update script's updatedAt timestamp
    await ctx.db.patch(block.scriptId, { updatedAt: Date.now() });
  },
});

