import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Block type validator for screenplay elements
const blockType = v.union(
  v.literal("sceneHeading"),
  v.literal("action"),
  v.literal("character"),
  v.literal("dialogue"),
  v.literal("parenthetical"),
  v.literal("transition"),
  v.literal("shot")
);

export default defineSchema({
  // Scripts table: metadata for each screenplay
  scripts: defineTable({
    title: v.string(),
    author: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Script blocks: individual screenplay elements with fractional indexing
  scriptBlocks: defineTable({
    scriptId: v.id("scripts"),
    blockId: v.string(), // UUID for stable identity
    type: blockType, // Block type enum
    content: v.string(), // Raw text content
    order: v.string(), // Fractional index (e.g., "a0", "a1", "a0V")
    metadata: v.optional(
      v.object({
        characterName: v.optional(v.string()),
        sceneNumber: v.optional(v.number()),
      })
    ),
  })
    .index("by_script", ["scriptId"])
    .index("by_script_order", ["scriptId", "order"]),

  // Collaborators: user presence and permissions
  collaborators: defineTable({
    scriptId: v.id("scripts"),
    userId: v.string(),
    permission: v.union(
      v.literal("read"),
      v.literal("write"),
      v.literal("admin")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_script", ["scriptId"])
    .index("by_user", ["userId"]),

  // Presence: track active users in real-time
  presence: defineTable({
    scriptId: v.id("scripts"),
    userId: v.string(),
    userName: v.string(),
    userColor: v.string(), // For cursor color
    activeBlockId: v.optional(v.string()), // Which block they're editing
    lastSeen: v.number(), // Timestamp for heartbeat
  })
    .index("by_script", ["scriptId"])
    .index("by_user", ["userId"]),
});
