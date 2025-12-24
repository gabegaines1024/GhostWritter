// Block types for screenplay elements
export type BlockType =
  | "sceneHeading"
  | "action"
  | "character"
  | "dialogue"
  | "parenthetical"
  | "transition"
  | "shot";

// Block metadata (optional properties)
export interface BlockMetadata {
  characterName?: string;
  sceneNumber?: number;
}

// Script block from Convex
export interface ScriptBlock {
  _id: string;
  scriptId: string;
  blockId: string;
  type: BlockType;
  content: string;
  order: string;
  metadata?: BlockMetadata;
}

// Script metadata
export interface Script {
  _id: string;
  title: string;
  author: string;
  createdAt: number;
  updatedAt: number;
}

// Permission levels for collaborators
export type Permission = "read" | "write" | "admin";

// Collaborator entry
export interface Collaborator {
  _id: string;
  scriptId: string;
  userId: string;
  permission: Permission;
  createdAt: number;
  updatedAt: number;
}

// TipTap node attributes (for editor integration)
export interface TipTapBlockAttrs {
  blockId: string;
  type: BlockType;
}

// Conversion types for TipTap ↔ Convex
export interface TipTapNode {
  type: BlockType;
  attrs: TipTapBlockAttrs;
  content: Array<{ type: "text"; text: string }>;
}

