/**
 * Fractional Indexing Utilities
 *
 * This module provides helpers for ordering blocks using fractional indexing.
 * Install the package: npm install fractional-indexing
 *
 * Usage:
 * - generateKeyBetween(a, b) - Generate a key between two existing keys
 * - insertAfter(existingKey) - Get a key to insert after an existing block
 * - insertBefore(existingKey) - Get a key to insert before an existing block
 * - getInitialKey() - Get the first key for an empty document
 */

// TODO: Implement after installing fractional-indexing package
// import { generateKeyBetween } from "fractional-indexing";

/**
 * Generate a key between two existing keys
 * @param a - The key before (null for start of list)
 * @param b - The key after (null for end of list)
 * @returns A new key between a and b
 */
export function generateOrderKey(
  a: string | null,
  b: string | null
): string {
  // Placeholder - implement with fractional-indexing library
  // return generateKeyBetween(a, b);
  throw new Error("Install fractional-indexing package and implement");
}

/**
 * Get the initial key for the first block in a document
 */
export function getInitialKey(): string {
  return generateOrderKey(null, null);
}

/**
 * Generate a key to insert after an existing block
 * @param existingKey - The key of the block to insert after
 * @param nextKey - The key of the next block (or null if at end)
 */
export function insertAfterKey(
  existingKey: string,
  nextKey: string | null
): string {
  return generateOrderKey(existingKey, nextKey);
}

/**
 * Generate a key to insert before an existing block
 * @param existingKey - The key of the block to insert before
 * @param prevKey - The key of the previous block (or null if at start)
 */
export function insertBeforeKey(
  prevKey: string | null,
  existingKey: string
): string {
  return generateOrderKey(prevKey, existingKey);
}

