import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { permission, title } from "process";

export default defineSchema({
  scripts: defineTable({
    title: v.string(),
    author: v.string(), 
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  scriptBlocks: defineTable({
    scriptId: v.id("scripts"),
    blockId: v.string(),
    type: v.string(),
    content: v.string(),
    order: v.number()
  }),
  collaborators: defineTable({
    scriptId: v.id("scripts"),
    userId: v.string(),
    permission: v.union(v.literal("read"), v.literal("write"), v.literal("admin")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
});