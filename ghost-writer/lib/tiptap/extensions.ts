/**
 * TipTap Custom Extensions
 *
 * Custom extensions for screenplay-specific block types.
 * Each node represents a screenplay element with proper formatting.
 */

import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Base attributes shared by all screenplay nodes
 */
const baseAttributes = {
  blockId: {
    default: "",
    parseHTML: (element: HTMLElement) => element.getAttribute("data-block-id"),
    renderHTML: (attributes: { blockId: string }) => ({
      "data-block-id": attributes.blockId,
    }),
  },
};

/**
 * Scene Heading Extension
 *
 * Format: INT./EXT. LOCATION - TIME
 * Styling: All caps, bold
 */
export const SceneHeading = Node.create({
  name: "sceneHeading",
  group: "block",
  content: "text*",
  defining: true,

  addAttributes() {
    return {
      ...baseAttributes,
      sceneNumber: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-scene-number"),
        renderHTML: (attributes: { sceneNumber: number | null }) =>
          attributes.sceneNumber
            ? { "data-scene-number": attributes.sceneNumber }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="scene-heading"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "scene-heading",
        class: "screenplay-scene-heading",
      }),
      0,
    ];
  },
});

/**
 * Action Extension
 *
 * Format: Standard paragraph describing action/description
 * Styling: Full width, regular text
 */
export const Action = Node.create({
  name: "action",
  group: "block",
  content: "text*",
  defining: true,

  addAttributes() {
    return baseAttributes;
  },

  parseHTML() {
    return [{ tag: 'div[data-type="action"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "action",
        class: "screenplay-action",
      }),
      0,
    ];
  },
});

/**
 * Character Extension
 *
 * Format: Character name (with optional extension like V.O., O.S.)
 * Styling: Centered, uppercase
 */
export const Character = Node.create({
  name: "character",
  group: "block",
  content: "text*",
  defining: true,

  addAttributes() {
    return {
      ...baseAttributes,
      characterName: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-character-name"),
        renderHTML: (attributes: { characterName: string | null }) =>
          attributes.characterName
            ? { "data-character-name": attributes.characterName }
            : {},
      },
      extension: {
        default: null, // V.O., O.S., CONT'D, etc.
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-extension"),
        renderHTML: (attributes: { extension: string | null }) =>
          attributes.extension
            ? { "data-extension": attributes.extension }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="character"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "character",
        class: "screenplay-character",
      }),
      0,
    ];
  },
});

/**
 * Dialogue Extension
 *
 * Format: Character's spoken lines
 * Styling: Indented from both sides
 */
export const Dialogue = Node.create({
  name: "dialogue",
  group: "block",
  content: "text*",
  defining: true,

  addAttributes() {
    return baseAttributes;
  },

  parseHTML() {
    return [{ tag: 'div[data-type="dialogue"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "dialogue",
        class: "screenplay-dialogue",
      }),
      0,
    ];
  },
});

/**
 * Parenthetical Extension
 *
 * Format: Actor direction within dialogue (in parentheses)
 * Styling: Smaller, centered, italicized
 */
export const Parenthetical = Node.create({
  name: "parenthetical",
  group: "block",
  content: "text*",
  defining: true,

  addAttributes() {
    return baseAttributes;
  },

  parseHTML() {
    return [{ tag: 'div[data-type="parenthetical"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "parenthetical",
        class: "screenplay-parenthetical",
      }),
      0,
    ];
  },
});

/**
 * Transition Extension
 *
 * Format: CUT TO:, FADE OUT., DISSOLVE TO:, etc.
 * Styling: Right-aligned, uppercase
 */
export const Transition = Node.create({
  name: "transition",
  group: "block",
  content: "text*",
  defining: true,

  addAttributes() {
    return baseAttributes;
  },

  parseHTML() {
    return [{ tag: 'div[data-type="transition"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "transition",
        class: "screenplay-transition",
      }),
      0,
    ];
  },
});

/**
 * Shot Extension
 *
 * Format: ANGLE ON, CLOSE UP, POV, etc.
 * Styling: Uppercase, left-aligned
 */
export const Shot = Node.create({
  name: "shot",
  group: "block",
  content: "text*",
  defining: true,

  addAttributes() {
    return baseAttributes;
  },

  parseHTML() {
    return [{ tag: 'div[data-type="shot"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "shot",
        class: "screenplay-shot",
      }),
      0,
    ];
  },
});

/**
 * All screenplay extensions bundled together
 */
export const screenplayExtensions = [
  SceneHeading,
  Action,
  Character,
  Dialogue,
  Parenthetical,
  Transition,
  Shot,
];

/**
 * Export individual extensions and the bundle
 */
export const extensions = {
  SceneHeading,
  Action,
  Character,
  Dialogue,
  Parenthetical,
  Transition,
  Shot,
  all: screenplayExtensions,
};
