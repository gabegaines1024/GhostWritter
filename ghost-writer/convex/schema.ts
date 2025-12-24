import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { title } from "process";

export default defineSchema({
  users: defineTable({
    title: v.string(),
    author: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});