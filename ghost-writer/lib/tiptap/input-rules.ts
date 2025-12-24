/**
 * TipTap Input Rules
 *
 * Auto-formatting rules for screenplay writing.
 *
 * TODO: Implement after setting up TipTap extensions
 */

// import { InputRule } from "@tiptap/core";

/**
 * Scene Heading Auto-Format
 *
 * Typing "INT." or "EXT." at the start of a line converts to Scene Heading
 */
// export const sceneHeadingInputRule = new InputRule({
//   find: /^(INT\.|EXT\.|INT\/EXT\.)\s$/,
//   handler: ({ state, range, match }) => {
//     // Convert to scene heading node
//   },
// });

/**
 * Transition Auto-Format
 *
 * Typing "CUT TO:" or "FADE" at the start converts to Transition
 */
// export const transitionInputRule = new InputRule({
//   find: /^(CUT TO:|FADE IN:|FADE OUT\.|DISSOLVE TO:)\s$/,
//   handler: ({ state, range, match }) => {
//     // Convert to transition node
//   },
// });

/**
 * Smart Enter Key Behavior
 *
 * - After Character → create Dialogue
 * - After Dialogue → create Character or Action
 * - After Scene Heading → create Action
 */

// Placeholder export
export const inputRules = {
  // Add input rules here after implementation
};

