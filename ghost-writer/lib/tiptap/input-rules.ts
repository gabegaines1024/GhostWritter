/**
 * TipTap Input Rules
 *
 * Auto-formatting rules for screenplay writing.
 * These rules automatically convert text patterns into proper screenplay blocks.
 */

import { InputRule } from "@tiptap/core";
import type { Editor } from "@tiptap/core";

/**
 * Scene Heading Input Rule
 *
 * Typing "INT.", "EXT.", or "INT/EXT." at the start of a line
 * converts the block to a Scene Heading.
 *
 * Examples:
 * - "INT. " → Scene Heading
 * - "EXT. " → Scene Heading
 * - "INT/EXT. " → Scene Heading
 * - "I/E. " → Scene Heading
 */
export const sceneHeadingInputRule = new InputRule({
  find: /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s$/i,
  handler: ({ state, range, match, commands }) => {
    const prefix = match[1].toUpperCase();

    // Delete the trigger text and convert to scene heading
    commands.deleteRange(range);
    commands.setNode("sceneHeading");

    // Insert the prefix back
    commands.insertContent(prefix + " ");
  },
});

/**
 * Transition Input Rule
 *
 * Typing transition keywords converts the block to a Transition.
 *
 * Examples:
 * - "CUT TO:" → Transition
 * - "FADE IN:" → Transition
 * - "FADE OUT." → Transition
 * - "DISSOLVE TO:" → Transition
 * - "SMASH CUT TO:" → Transition
 * - "MATCH CUT TO:" → Transition
 */
export const transitionInputRule = new InputRule({
  find: /^(CUT TO:|FADE IN:|FADE OUT\.|DISSOLVE TO:|SMASH CUT TO:|MATCH CUT TO:|FADE TO BLACK\.|TIME CUT:)\s*$/i,
  handler: ({ state, range, match, commands }) => {
    const transitionText = match[1].toUpperCase();

    commands.deleteRange(range);
    commands.setNode("transition");
    commands.insertContent(transitionText);
  },
});

/**
 * Shot Input Rule
 *
 * Typing shot keywords at the start converts to Shot block.
 *
 * Examples:
 * - "ANGLE ON " → Shot
 * - "CLOSE ON " → Shot
 * - "CLOSE UP " → Shot
 * - "POV " → Shot
 * - "WIDE SHOT " → Shot
 */
export const shotInputRule = new InputRule({
  find: /^(ANGLE ON|CLOSE ON|CLOSE UP|CLOSEUP|EXTREME CLOSE UP|ECU|POV|WIDE SHOT|WIDE ON|INSERT|AERIAL|ESTABLISHING)\s$/i,
  handler: ({ state, range, match, commands }) => {
    const shotText = match[1].toUpperCase();

    commands.deleteRange(range);
    commands.setNode("shot");
    commands.insertContent(shotText + " ");
  },
});

/**
 * Parenthetical Input Rule
 *
 * Typing "(" at the start of a dialogue line converts to Parenthetical.
 */
export const parentheticalInputRule = new InputRule({
  find: /^\($/,
  handler: ({ state, range, commands }) => {
    // Only convert if previous block is dialogue or character
    const { $from } = state.selection;
    const prevNode = $from.doc.resolve($from.pos - 1).parent;
    const prevNodeName = prevNode?.type?.name;

    if (prevNodeName === "dialogue" || prevNodeName === "character") {
      commands.deleteRange(range);
      commands.setNode("parenthetical");
      commands.insertContent("(");
    }
  },
});

/**
 * Get the block type that should follow the current block type
 * Used for smart Enter key behavior
 */
export function getNextBlockType(
  currentType: string
): "action" | "dialogue" | "character" | "sceneHeading" | null {
  switch (currentType) {
    case "sceneHeading":
      return "action";
    case "action":
      return "action"; // Stay in action, Tab to switch
    case "character":
      return "dialogue";
    case "dialogue":
      return "character"; // Or action with double-enter
    case "parenthetical":
      return "dialogue";
    case "transition":
      return "sceneHeading";
    case "shot":
      return "action";
    default:
      return null;
  }
}

/**
 * Smart Enter Key Handler
 *
 * Creates the next logical block type based on screenplay flow:
 * - Scene Heading → Action
 * - Action → Action (Tab to change)
 * - Character → Dialogue
 * - Dialogue → Character (double-enter for Action)
 * - Parenthetical → Dialogue
 * - Transition → Scene Heading
 */
export function handleSmartEnter(editor: Editor): boolean {
  const { state } = editor;
  const { selection } = state;
  const { $from } = selection;

  // Get current node type
  const currentNode = $from.parent;
  const currentType = currentNode.type.name;

  // Determine next block type
  const nextType = getNextBlockType(currentType);

  if (nextType) {
    // Insert new block of the appropriate type
    editor
      .chain()
      .focus()
      .splitBlock()
      .setNode(nextType)
      .run();

    return true;
  }

  return false;
}

/**
 * Tab Key Handler
 *
 * Cycles through block types in screenplay order:
 * Action → Character → Dialogue → Parenthetical → Action
 */
export function handleTabCycle(editor: Editor, reverse = false): boolean {
  const { state } = editor;
  const { selection } = state;
  const { $from } = selection;

  const currentNode = $from.parent;
  const currentType = currentNode.type.name;

  // Define cycle order
  const cycleOrder = [
    "action",
    "character",
    "dialogue",
    "parenthetical",
  ];

  const currentIndex = cycleOrder.indexOf(currentType);

  if (currentIndex === -1) {
    // Not a cyclable type, convert to action
    editor.chain().focus().setNode("action").run();
    return true;
  }

  // Calculate next index
  let nextIndex: number;
  if (reverse) {
    nextIndex = currentIndex === 0 ? cycleOrder.length - 1 : currentIndex - 1;
  } else {
    nextIndex = (currentIndex + 1) % cycleOrder.length;
  }

  const nextType = cycleOrder[nextIndex];
  editor.chain().focus().setNode(nextType).run();

  return true;
}

/**
 * All input rules for screenplay formatting
 */
export const screenplayInputRules = [
  sceneHeadingInputRule,
  transitionInputRule,
  shotInputRule,
  parentheticalInputRule,
];

/**
 * Export all input rules and handlers
 */
export const inputRules = {
  sceneHeading: sceneHeadingInputRule,
  transition: transitionInputRule,
  shot: shotInputRule,
  parenthetical: parentheticalInputRule,
  all: screenplayInputRules,
  handlers: {
    smartEnter: handleSmartEnter,
    tabCycle: handleTabCycle,
  },
};
