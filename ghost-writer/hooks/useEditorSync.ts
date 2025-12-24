/**
 * useEditorSync Hook
 *
 * Synchronize TipTap editor state with Convex database.
 * Handles debounced updates and conflict resolution.
 *
 * TODO: Implement after setting up TipTap editor
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";

const DEBOUNCE_MS = 500;

export interface UseEditorSyncOptions {
  scriptId: string;
  // editor: Editor | null;
}

export function useEditorSync({ scriptId }: UseEditorSyncOptions) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // TODO: Subscribe to script blocks from Convex
  // const blocks = useQuery(api.scriptBlocks.getByScript, { scriptId });

  // TODO: Mutation for updating blocks
  // const updateBlock = useMutation(api.scriptBlocks.updateContent);

  /**
   * Debounced save function
   */
  const debouncedSave = useCallback(
    (_blockId: string, _content: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        // TODO: Call Convex mutation
        // updateBlock({ blockId, content });
        console.log(`Saving block ${_blockId} after ${DEBOUNCE_MS}ms debounce`);
      }, DEBOUNCE_MS);
    },
    [scriptId]
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
    blocks: [], // Replace with actual blocks from Convex
    debouncedSave,
    isLoading: false,
  };
}

