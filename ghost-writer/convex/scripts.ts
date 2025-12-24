/**
 * Script CRUD Operations
 *
 * Mutations and queries for managing screenplay documents.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new script
 */
export const create = mutation({
  args: {
    title: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const scriptId = await ctx.db.insert("scripts", {
      title: args.title,
      author: args.author,
      createdAt: now,
      updatedAt: now,
    });
    return scriptId;
  },
});

/**
 * Get a script by ID
 */
export const get = query({
  args: { scriptId: v.id("scripts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scriptId);
  },
});

/**
 * List all scripts
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("scripts").order("desc").collect();
  },
});

/**
 * Update a script's metadata
 */
export const update = mutation({
  args: {
    scriptId: v.id("scripts"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { scriptId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(scriptId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete a script and all its blocks
 */
export const remove = mutation({
  args: { scriptId: v.id("scripts") },
  handler: async (ctx, args) => {
    // Delete all blocks belonging to this script
    const blocks = await ctx.db
      .query("scriptBlocks")
      .withIndex("by_script", (q) => q.eq("scriptId", args.scriptId))
      .collect();

    for (const block of blocks) {
      await ctx.db.delete(block._id);
    }

    // Delete the script itself
    await ctx.db.delete(args.scriptId);
  },
});

