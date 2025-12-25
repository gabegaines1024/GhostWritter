/**
 * useEditorSync Hook
 *
 * Synchronize TipTap editor state with Convex database.
 * Handles debounced updates and conflict resolution.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import type { Editor } from "@tiptap/react";
import { convexBlocksToTipTapDoc } from "../lib/convex-tiptap-bridge";
import { generateOrderKey, getInitialKey } from "../lib/fractional-index";

/**
 * Generate a UUID v4 without external dependency
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const DEBOUNCE_MS = 500;

export interface UseEditorSyncOptions {
  scriptId: string;
  editor: Editor | null;
}

export function useEditorSync({ scriptId, editor }: UseEditorSyncOptions) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isInitializedRef = useRef(false);

  // Subscribe to script blocks from Convex
  const blocks = useQuery(api.scriptBlocks.getByScript, {
    scriptId: scriptId as Id<"scripts">,
  });

  // Mutations
  const createBlock = useMutation(api.scriptBlocks.create);
  const updateBlockContent = useMutation(api.scriptBlocks.updateContent);
  const changeBlockType = useMutation(api.scriptBlocks.changeType);
  const deleteBlock = useMutation(api.scriptBlocks.remove);

  /**
   * Initialize editor with content from Convex
   */
  useEffect(() => {
    if (editor && blocks && !isInitializedRef.current) {
      if (blocks.length > 0) {
        const doc = convexBlocksToTipTapDoc(blocks);
        editor.commands.setContent(doc);
      }
      isInitializedRef.current = true;
    }
  }, [editor, blocks]);

  /**
   * Debounced save function for content updates
   */
  const debouncedSaveContent = useCallback(
    (blockDocId: string, content: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setIsSaving(true);

      debounceTimerRef.current = setTimeout(async () => {
        try {
          await updateBlockContent({
            blockDocId: blockDocId as Id<"scriptBlocks">,
            content,
          });
          setLastSaved(new Date());
        } catch (error) {
          console.error("Failed to save block:", error);
        } finally {
          setIsSaving(false);
        }
      }, DEBOUNCE_MS);
    },
    [updateBlockContent]
  );

  /**
   * Immediately save block type change (no debounce)
   */
  const saveBlockType = useCallback(
    async (blockDocId: string, type: string) => {
      setIsSaving(true);
      try {
        await changeBlockType({
          blockDocId: blockDocId as Id<"scriptBlocks">,
          type: type as
            | "sceneHeading"
            | "action"
            | "character"
            | "dialogue"
            | "parenthetical"
            | "transition"
            | "shot",
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to change block type:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [changeBlockType]
  );

  /**
   * Create a new block
   */
  const addBlock = useCallback(
    async (
      type: string,
      content: string,
      afterBlockOrder?: string | null
    ) => {
      const lastBlock = blocks?.[blocks.length - 1];
      const order = afterBlockOrder
        ? generateOrderKey(afterBlockOrder, null)
        : lastBlock
          ? generateOrderKey(lastBlock.order, null)
          : getInitialKey();

      try {
        await createBlock({
          scriptId: scriptId as Id<"scripts">,
          blockId: generateUUID(),
          type: type as
            | "sceneHeading"
            | "action"
            | "character"
            | "dialogue"
            | "parenthetical"
            | "transition"
            | "shot",
          content,
          order,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to create block:", error);
      }
    },
    [createBlock, scriptId, blocks]
  );

  /**
   * Remove a block
   */
  const removeBlock = useCallback(
    async (blockDocId: string) => {
      try {
        await deleteBlock({
          blockDocId: blockDocId as Id<"scriptBlocks">,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to delete block:", error);
      }
    },
    [deleteBlock]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    blocks: blocks ?? [],
    isLoading: blocks === undefined,
    isSaving,
    lastSaved,
    debouncedSaveContent,
    saveBlockType,
    addBlock,
    removeBlock,
  };
}
