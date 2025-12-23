GhostWriter: Technical Implementation Plan
Project Overview
A real-time, collaborative screenwriting engine that understands screenplay semantics and feels like a professional desktop application.
Stack: Next.js 15 (App Router) + React + TipTap + Convex + Shadcn UI + TypeScript

Phase 1: Data Modeling (Convex Schema & TS Types)
Goal: Define the single source of truth for screenplay data.
Tasks

Convex Schema Design

scripts table: metadata (title, author, created/updated timestamps)
scriptBlocks table: individual screenplay elements with fractional indexing

Fields: scriptId, blockId, type, content, order (fractional index), metadata


collaborators table: user presence and permissions


TypeScript Types

Create types/screenplay.ts with strict unions:



typescript     type BlockType = 'sceneHeading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition' | 'shot';
     type ScriptBlock = { id: string; type: BlockType; content: string; order: string; ... }

Define TipTap-specific types that map to Convex types
Create conversion utilities: convexBlockToTipTap() and tipTapToConvexBlock()


Fractional Indexing System

Implement or integrate a fractional indexing library (e.g., fractional-indexing npm package)
Add Convex mutation helpers: insertBlockAfter(), moveBlock(), reorderBlocks()



Deliverables

convex/schema.ts with all tables
types/screenplay.ts with complete type definitions
lib/fractional-index.ts with ordering utilities
convex/scriptBlocks.ts with CRUD mutations and queries


Phase 2: Core Editor (TipTap + React Custom Nodes)
Goal: Build a screenplay-aware editor with custom formatting.
Tasks

TipTap Configuration

Initialize editor with screenplay-specific extensions
Configure Document, Text, Paragraph base nodes
Add History (undo/redo) and Placeholder extensions


Custom Screenplay Nodes

Create React components for each block type:

SceneHeadingNode.tsx: All-caps, bold styling
CharacterNode.tsx: Centered, uppercase
DialogueNode.tsx: Indented, specific margins
ActionNode.tsx: Standard paragraph with different spacing


Use NodeViewContent for editable content within custom nodes
Implement ReactNodeViewRenderer for each node type


Input Rules & Commands

Auto-format: "INT." or "EXT." → SceneHeading
Tab key behavior: context-aware indentation
Enter key behavior: smart next-block creation (Dialogue → Character, etc.)
Create custom TipTap commands: setSceneHeading(), setDialogue(), etc.


Editor State Management

Create useEditor hook that initializes TipTap
Implement useEditorSync hook for Convex ↔ TipTap synchronization
Handle debounced updates (300-500ms) to Convex on local changes
Implement onUpdate callback to capture changes as Convex mutations



Deliverables

components/editor/TipTapEditor.tsx: Main editor component
components/editor/nodes/: Directory with all custom node components
lib/tiptap/extensions.ts: Custom extensions and input rules
hooks/useEditorSync.ts: Synchronization logic


Phase 3: The Shell (Next.js Layout + Shadcn Components)
Goal: Professional UI that houses the editor and tooling.
Tasks

App Structure

/app/layout.tsx: Root layout with Convex provider
/app/scripts/page.tsx: Script list view
/app/scripts/[scriptId]/page.tsx: Editor view
Implement Next.js 15 App Router with proper data fetching


Shadcn UI Integration

Install and configure Shadcn components
Create Sidebar with script navigator and formatting tools
Create Toolbar with screenplay-specific actions (character list, scene list)
Create CommandPalette for keyboard shortcuts (Cmd+K)
Create StatusBar showing word count, page count, cursor position


Layout Components

ScriptList.tsx: Grid/list view of all scripts
EditorShell.tsx: Container with sidebar, editor, and metadata panel
FormatToolbar.tsx: Floating or fixed toolbar for block type changes
Responsive design: hide sidebars on mobile, show hamburger menu


Routing & Navigation

Protected routes (if adding auth later)
Loading states with Suspense boundaries
Error boundaries for graceful failures



Deliverables

Complete Next.js app structure
components/ui/: Shadcn components (Button, Dialog, Dropdown, etc.)
components/layout/: Shell components (Sidebar, Toolbar, StatusBar)
app/scripts/: All routing components


Phase 4: Collaboration (Presence & Real-time Sync)
Goal: Multi-user editing with conflict resolution.
Tasks

Presence System

Track active users in presence table (Convex)
Show collaborator cursors with color coding
Display user avatars in editor header
Implement "who's viewing" indicator


Real-time Synchronization

Subscribe to scriptBlocks changes via Convex useQuery
Handle incoming changes: merge remote updates into TipTap without disrupting local edits
Implement conflict resolution: last-write-wins with per-block granularity
Use TipTap's transaction.setMeta('preventUpdate') to avoid echo loops


Operational Transform (Optional Enhancement)

If strict conflict resolution is needed, integrate Y.js with TipTap + Convex
Alternative: Use Convex's built-in optimistic updates with careful timestamp tracking


Multiplayer UX

Lock blocks during editing by another user (optional)
Show "User X is typing in Scene 5" notifications
Implement comment threads on blocks (if scope allows)
Add activity feed: "User Y changed Scene 3 to Night"



Deliverables

lib/presence.ts: Presence tracking logic
hooks/usePresence.ts: Real-time presence hook
components/editor/CollaboratorCursor.tsx: Visual cursor component
Updated useEditorSync with conflict resolution


Cross-Phase Considerations
Performance

Virtualization: For long scripts (100+ pages), use react-window to virtualize blocks outside viewport
Lazy Loading: Load only visible scenes initially, fetch others on scroll
Memoization: Use React.memo on custom nodes to prevent unnecessary re-renders

Testing Strategy

Unit tests: Fractional indexing, block type validation
Integration tests: TipTap ↔ Convex sync
E2E tests: Playwright for multi-user scenarios

AI Integration (Future)

Convex Actions for OpenAI/Anthropic API calls
"Generate Scene", "Suggest Dialogue", "Format Check" features
Streaming responses into editor blocks


Success Criteria

 Editor loads in <1s with 50 blocks
 Real-time updates appear within 200ms
 No data loss during concurrent edits
 Professional feel: no jank, smooth typing, proper screenplay formatting
 Mobile-responsive (even if limited editing on small screens)
