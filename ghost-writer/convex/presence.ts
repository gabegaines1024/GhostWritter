/**
 * Presence Tracking
 *
 * Real-time presence tracking for collaborative editing.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// How long before a user is considered "away" (30 seconds)
const PRESENCE_TIMEOUT = 30 * 1000;

/**
 * Get all active users in a script
 */
export const getActiveUsers = query({
  args: { scriptId: v.id("scripts") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const presenceRecords = await ctx.db
      .query("presence")
      .withIndex("by_script", (q) => q.eq("scriptId", args.scriptId))
      .collect();

    // Filter to only active users (seen within timeout)
    return presenceRecords.filter(
      (record) => now - record.lastSeen < PRESENCE_TIMEOUT
    );
  },
});

/**
 * Update or create presence record (heartbeat)
 */
export const heartbeat = mutation({
  args: {
    scriptId: v.id("scripts"),
    userId: v.string(),
    userName: v.string(),
    userColor: v.string(),
    activeBlockId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find existing presence record for this user
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        scriptId: args.scriptId,
        userName: args.userName,
        userColor: args.userColor,
        activeBlockId: args.activeBlockId,
        lastSeen: Date.now(),
      });
    } else {
      // Create new presence record
      await ctx.db.insert("presence", {
        scriptId: args.scriptId,
        userId: args.userId,
        userName: args.userName,
        userColor: args.userColor,
        activeBlockId: args.activeBlockId,
        lastSeen: Date.now(),
      });
    }
  },
});

/**
 * Update which block a user is currently editing
 */
export const updateActiveBlock = mutation({
  args: {
    userId: v.string(),
    activeBlockId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        activeBlockId: args.activeBlockId,
        lastSeen: Date.now(),
      });
    }
  },
});

/**
 * Remove presence when user leaves
 */
export const leave = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

