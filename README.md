# GhostWritter
🚀 The Tech Stack
Framework: Next.js 15 (App Router, Server Actions)

Database & Real-time: Convex (Reactive functions, Vector search, and File storage)

Styling & UI: shadcn/ui + Tailwind CSS

Editor Core: TipTap / ProseMirror (Custom extensions for script elements)

Type Safety: TypeScript (Strictly typed schema and discriminated unions for document nodes)

Authentication: Clerk or Convex Auth

✨ Key Features
1. Semantic Script Editor
The editor doesn't just store text; it stores structured blocks.

Auto-Formatting: Use Tab and Enter shortcuts to cycle through Scene Headings, Action, Character, and Dialogue.

Type-Safe Blocks: Every block is a TypeScript-defined object, making data manipulation (like reordering scenes) foolproof.

2. Multi-Player Collaboration
Powered by Convex's reactive engine:

Live Presence: See which scene your co-writer is currently working on with "focused-block" highlighting.

Conflict-Free Editing: Leveraging Convex's optimistic updates for a lag-free, Google Docs-style experience.

3. The "Character Bible"
A side-panel database of characters.

Reactive Sync: Renaming a character in the Bible updates every instance of their name in the script dialogue across all users instantly.

AI Insights: Use Convex Actions to analyze character dialogue for consistency in "voice" or "tone."

4. Professional Workflow Tools
Command Menu (⌘+K): A shadcn-based command palette for quick navigation between scenes or triggering AI scene summaries.

Version Snapshots: Store and restore previous versions of a script using Convex's built-in document versioning.

Industry Standard Export: One-click PDF generation that adheres to strict Hollywood margin and font (Courier Prime) requirements.
