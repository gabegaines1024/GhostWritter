# GhostWriter: Technical Implementation Plan

## Project Overview
A real-time, collaborative screenwriting engine that understands screenplay semantics and feels like a professional desktop application.

**Stack**: Next.js 15 (App Router) + React + TipTap + Convex + Shadcn UI + TypeScript

---

## Phase 1: Data Modeling (Convex Schema & TS Types)
**Goal**: Define the single source of truth for screenplay data.

### Tasks
1. **Convex Schema Design**
   - `scripts` table: metadata (title, author, created/updated timestamps)
   - `scriptBlocks` table: individual screenplay elements with fractional indexing
     - Fields: `scriptId`, `blockId`, `type`, `content`, `order` (fractional index), `metadata`
   - `collaborators` table: user presence and permissions

2. **TypeScript Types**
   - Create `types/screenplay.ts` with strict unions:
     ```typescript
     type BlockType = 'sceneHeading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition' | 'shot';
     type ScriptBlock = { id: string; type: BlockType; content: string; order: string; ... }
     ```
   - Define TipTap-specific types that map to Convex types
   - Create conversion utilities: `convexBlockToTipTap()` and `tipTapToConvexBlock()`

3. **Fractional Indexing System**
   - Implement or integrate a fractional indexing library (e.g., `fractional-indexing` npm package)
   - Add Convex mutation helpers: `insertBlockAfter()`, `moveBlock()`, `reorderBlocks()`

### Deliverables
- `convex/schema.ts` with all tables
- `types/screenplay.ts` with complete type definitions
- `lib/fractional-index.ts` with ordering utilities
- `convex/scriptBlocks.ts` with CRUD mutations and queries

---

## Phase 2: Core Editor (TipTap + React Custom Nodes)
**Goal**: Build a screenplay-aware editor with custom formatting.

### Tasks
1. **TipTap Configuration**
   - Initialize editor with screenplay-specific extensions
   - Configure `Document`, `Text`, `Paragraph` base nodes
   - Add `History` (undo/redo) and `Placeholder` extensions

2. **Custom Screenplay Nodes**
   - Create React components for each block type:
     - `SceneHeadingNode.tsx`: All-caps, bold styling
     - `CharacterNode.tsx`: Centered, uppercase
     - `DialogueNode.tsx`: Indented, specific margins
     - `ActionNode.tsx`: Standard paragraph with different spacing
   - Use `NodeViewContent` for editable content within custom nodes
   - Implement `ReactNodeViewRenderer` for each node type

3. **Input Rules & Commands**
   - Auto-format: "INT." or "EXT." → SceneHeading
   - Tab key behavior: context-aware indentation
   - Enter key behavior: smart next-block creation (Dialogue → Character, etc.)
   - Create custom TipTap commands: `setSceneHeading()`, `setDialogue()`, etc.

4. **Editor State Management**
   - Create `useEditor` hook that initializes TipTap
   - Implement `useEditorSync` hook for Convex ↔ TipTap synchronization
   - Handle debounced updates (300-500ms) to Convex on local changes
   - Implement `onUpdate` callback to capture changes as Convex mutations

### Deliverables
- `components/editor/TipTapEditor.tsx`: Main editor component
- `components/editor/nodes/`: Directory with all custom node components
- `lib/tiptap/extensions.ts`: Custom extensions and input rules
- `hooks/useEditorSync.ts`: Synchronization logic

---

## Phase 3: The Shell (Next.js Layout + Shadcn Components)
**Goal**: Professional UI that houses the editor and tooling.

### Tasks
1. **App Structure**
   - `/app/layout.tsx`: Root layout with Convex provider
   - `/app/scripts/page.tsx`: Script list view
   - `/app/scripts/[scriptId]/page.tsx`: Editor view
   - Implement Next.js 15 App Router with proper data fetching

2. **Shadcn UI Integration**
   - Install and configure Shadcn components
   - Create `Sidebar` with script navigator and formatting tools
   - Create `Toolbar` with screenplay-specific actions (character list, scene list)
   - Create `CommandPalette` for keyboard shortcuts (Cmd+K)
   - Create `StatusBar` showing word count, page count, cursor position

3. **Layout Components**
   - `ScriptList.tsx`: Grid/list view of all scripts
   - `EditorShell.tsx`: Container with sidebar, editor, and metadata panel
   - `FormatToolbar.tsx`: Floating or fixed toolbar for block type changes
   - Responsive design: hide sidebars on mobile, show hamburger menu

4. **Routing & Navigation**
   - Protected routes (if adding auth later)
   - Loading states with Suspense boundaries
   - Error boundaries for graceful failures

### Deliverables
- Complete Next.js app structure
- `components/ui/`: Shadcn components (Button, Dialog, Dropdown, etc.)
- `components/layout/`: Shell components (Sidebar, Toolbar, StatusBar)
- `app/scripts/`: All routing components

---

## Phase 4: Collaboration (Presence & Real-time Sync)
**Goal**: Multi-user editing with conflict resolution.

### Tasks
1. **Presence System**
   - Track active users in `presence` table (Convex)
   - Show collaborator cursors with color coding
   - Display user avatars in editor header
   - Implement "who's viewing" indicator

2. **Real-time Synchronization**
   - Subscribe to `scriptBlocks` changes via Convex `useQuery`
   - Handle incoming changes: merge remote updates into TipTap without disrupting local edits
   - Implement conflict resolution: last-write-wins with per-block granularity
   - Use TipTap's `transaction.setMeta('preventUpdate')` to avoid echo loops

3. **Operational Transform (Optional Enhancement)**
   - If strict conflict resolution is needed, integrate Y.js with TipTap + Convex
   - Alternative: Use Convex's built-in optimistic updates with careful timestamp tracking

4. **Multiplayer UX**
   - Lock blocks during editing by another user (optional)
   - Show "User X is typing in Scene 5" notifications
   - Implement comment threads on blocks (if scope allows)
   - Add activity feed: "User Y changed Scene 3 to Night"

### Deliverables
- `lib/presence.ts`: Presence tracking logic
- `hooks/usePresence.ts`: Real-time presence hook
- `components/editor/CollaboratorCursor.tsx`: Visual cursor component
- Updated `useEditorSync` with conflict resolution

---

## Cross-Phase Considerations

### Performance
- **Virtualization**: For long scripts (100+ pages), use `react-window` to virtualize blocks outside viewport
- **Lazy Loading**: Load only visible scenes initially, fetch others on scroll
- **Memoization**: Use `React.memo` on custom nodes to prevent unnecessary re-renders

### Testing Strategy
- Unit tests: Fractional indexing, block type validation
- Integration tests: TipTap ↔ Convex sync
- E2E tests: Playwright for multi-user scenarios

### AI Integration (Future)
- Convex Actions for OpenAI/Anthropic API calls
- "Generate Scene", "Suggest Dialogue", "Format Check" features
- Streaming responses into editor blocks

---

## Success Criteria
- [ ] Editor loads in <1s with 50 blocks
- [ ] Real-time updates appear within 200ms
- [ ] No data loss during concurrent edits
- [ ] Professional feel: no jank, smooth typing, proper screenplay formatting
- [ ] Mobile-responsive (even if limited editing on small screens)

---

---

## Architectural Decisions (LOCKED IN)

### 1. Block Granularity: One Document Per Block
**Decision**: Each screenplay element (Scene Heading, Action, Dialogue, etc.) is a separate Convex document in `scriptBlocks` table.

**Rationale**:
- Fine-grained collaboration: users can edit different blocks simultaneously without conflicts
- Better presence tracking: "User X is editing Block Y"
- Easier to implement selective syncing (only fetch visible blocks)
- Fractional indexing handles ordering elegantly

**Schema**:
```typescript
scriptBlocks: {
  scriptId: v.id("scripts"),
  blockId: v.string(),        // UUID for stable identity
  type: v.union(...),         // Block type enum
  content: v.string(),        // Raw text content
  order: v.string(),          // Fractional index (e.g., "a0", "a1", "a0V")
  metadata: v.optional(v.object({...}))  // Character name, scene number, etc.
}
```

---

### 2. Optimistic Updates: Hybrid Strategy
**Decision**: 
- **Text edits**: Local-first in TipTap, debounced write to Convex every 500ms
- **Structural changes**: Immediate optimistic mutation (block type change, reordering, deletion)

**Implementation**:
```typescript
// Text editing: debounced
const debouncedSave = useMemo(
  () => debounce((blockId, content) => {
    updateBlock({ blockId, content });
  }, 500),
  []
);

// Structural: immediate optimistic
const changeBlockType = useMutation(api.scriptBlocks.changeType)
  .withOptimisticUpdate((localStore, args) => {
    // Update local state immediately
  });
```

**Rationale**: Best of both worlds—responsive typing without server lag, immediate feedback for critical actions.

---

### 3. TipTap Structure: Flat Document
**Decision**: TipTap document contains a flat list of custom block nodes at the top level.

**Structure**:
```json
{
  "type": "doc",
  "content": [
    { "type": "sceneHeading", "attrs": { "blockId": "..." }, "content": [...] },
    { "type": "action", "attrs": { "blockId": "..." }, "content": [...] },
    { "type": "character", "attrs": { "blockId": "..." }, "content": [...] },
    { "type": "dialogue", "attrs": { "blockId": "..." }, "content": [...] }
  ]
}
```

**Rationale**: 
- Direct 1:1 mapping with Convex `scriptBlocks` table
- No nested scene wrapper complicates syncing
- Easier to implement block-level operations (insert, delete, reorder)

---

### 4. Pagination: Hybrid Approach
**Decision**: 
- **In-editor**: CSS approximation with line-height calculations (good enough for 95% of use cases)
- **On export**: Server-side precise calculation using fountain.js or custom logic

**Implementation**:
- Display approximate page breaks with `<PageBreak />` component every ~55 lines
- Add "Export to PDF" action that uses Convex Action to generate precise pagination
- Show page number in StatusBar based on cursor position

**Rationale**: Don't over-engineer for MVP. Screenwriters care about precise pagination only at export time.

---

### 5. Collaboration: Last-Write-Wins (MVP) → OT (Future)
**Decision**: 
- **Phase 4 (MVP)**: Block-level last-write-wins with timestamp conflict resolution
- **Future**: Migrate to Y.js for character-level OT if user demand requires it

**Conflict Resolution**:
```typescript
// When remote update arrives
if (remoteBlock.updatedAt > localBlock.updatedAt) {
  // Accept remote changes
  updateTipTapBlock(remoteBlock);
} else {
  // Keep local changes, re-send to server
  resyncBlock(localBlock);
}
```

**Rationale**: 
- Simpler to implement and debug
- Screenwriting is less concurrent than code editing (writers rarely edit same dialogue line simultaneously)
- Block-level granularity reduces conflicts compared to document-level
- Can add Y.js later without rewriting core architecture

---

## Complete Implementation Roadmap

### **Phase 1: Data Modeling** (Days 1-2)
**Files to Create**:
1. `convex/schema.ts` - Define all tables
2. `convex/scriptBlocks.ts` - CRUD mutations and queries
3. `convex/scripts.ts` - Script-level operations
4. `convex/presence.ts` - User presence tracking
5. `src/types/screenplay.ts` - TypeScript types
6. `src/lib/fractional-index.ts` - Ordering utilities
7. `src/lib/convex-tiptap-bridge.ts` - Conversion functions

**Acceptance Criteria**:
- [ ] Can create a script with metadata
- [ ] Can insert/update/delete/reorder blocks
- [ ] Fractional indexing works (insert between any two blocks)
- [ ] Types are fully typed (no `any`)

---

### **Phase 2: Core Editor** (Days 3-5)
**Files to Create**:
1. `src/components/editor/TipTapEditor.tsx` - Main editor
2. `src/components/editor/nodes/SceneHeadingNode.tsx`
3. `src/components/editor/nodes/ActionNode.tsx`
4. `src/components/editor/nodes/CharacterNode.tsx`
5. `src/components/editor/nodes/DialogueNode.tsx`
6. `src/components/editor/nodes/ParentheticalNode.tsx`
7. `src/components/editor/nodes/TransitionNode.tsx`
8. `src/lib/tiptap/extensions.ts` - Custom extensions
9. `src/lib/tiptap/input-rules.ts` - Auto-formatting rules
10. `src/hooks/useEditorSync.ts` - Convex ↔ TipTap sync
11. `src/hooks/useEditor.ts` - TipTap initialization

**Acceptance Criteria**:
- [ ] Editor renders with custom nodes
- [ ] Typing "INT." auto-converts to Scene Heading
- [ ] Tab key indents dialogue appropriately
- [ ] Enter key creates next logical block (Character → Dialogue)
- [ ] Changes debounce to Convex every 500ms
- [ ] Undo/redo works correctly

---

### **Phase 3: The Shell** (Days 6-8)
**Files to Create**:
1. `src/app/layout.tsx` - Root layout with ConvexProvider
2. `src/app/page.tsx` - Landing/script list page
3. `src/app/scripts/[scriptId]/page.tsx` - Editor page
4. `src/components/layout/Sidebar.tsx` - Left sidebar with scene list
5. `src/components/layout/Toolbar.tsx` - Top toolbar
6. `src/components/layout/StatusBar.tsx` - Bottom status bar
7. `src/components/ui/CommandPalette.tsx` - Cmd+K shortcuts
8. `src/components/ScriptList.tsx` - Grid of scripts
9. `src/components/SceneNavigator.tsx` - Jump to scene
10. `src/lib/keyboard-shortcuts.ts` - Shortcut handlers

**Shadcn Components to Install**:
```bash
npx shadcn@latest add button dialog dropdown-menu separator
npx shadcn@latest add command avatar badge scroll-area
```

**Acceptance Criteria**:
- [ ] Can create new script from list view
- [ ] Can open script and see editor
- [ ] Sidebar shows scene list (click to jump)
- [ ] Toolbar has format buttons (Scene Heading, Action, etc.)
- [ ] Status bar shows page count, word count, cursor position
- [ ] Cmd+K opens command palette with actions
- [ ] Responsive: works on tablet (mobile limited)

---

### **Phase 4: Collaboration** (Days 9-12)
**Files to Create**:
1. `src/hooks/usePresence.ts` - Track active users
2. `src/components/presence/CollaboratorCursor.tsx` - Live cursors
3. `src/components/presence/CollaboratorAvatar.tsx` - User avatars
4. `src/components/presence/ActivityFeed.tsx` - Recent changes
5. `convex/presence.ts` - Presence mutations (heartbeat, leave)
6. Update `useEditorSync.ts` - Add conflict resolution
7. `src/lib/conflict-resolver.ts` - Timestamp-based merging

**Acceptance Criteria**:
- [ ] See other users' avatars in header
- [ ] See colored cursors where others are typing
- [ ] Get notified when someone edits nearby blocks
- [ ] Changes from other users appear within 200ms
- [ ] Conflicts resolve predictably (last-write-wins)
- [ ] Presence clears when user closes tab

---

### **Phase 5: Polish & Performance** (Days 13-15)
**Tasks**:
1. **Virtualization**: Add `react-window` for long scripts (100+ blocks)
2. **Error Boundaries**: Graceful failures with retry
3. **Loading States**: Skeletons for script list and editor
4. **Keyboard Shortcuts**: Full Cmd/Ctrl support
5. **Export**: PDF export via Convex Action + Puppeteer
6. **Dark Mode**: Respect system preference
7. **Mobile**: Read-only view on phones
8. **Analytics**: Track feature usage (optional)

**Performance Targets**:
- [ ] Editor loads <1s with 50 blocks
- [ ] Typing feels instant (no input lag)
- [ ] Scrolling is smooth at 60fps
- [ ] Real-time updates <200ms latency

---

## Implementation Order (Step-by-Step)

### Week 1: Foundation
**Day 1-2**: Phase 1 (Data Modeling)
- Set up Convex schema
- Create TypeScript types
- Test fractional indexing with sample data

**Day 3-5**: Phase 2 (Core Editor)
- Build TipTap editor with custom nodes
- Implement auto-formatting rules
- Wire up Convex sync (single user first)

### Week 2: Application
**Day 6-8**: Phase 3 (The Shell)
- Build Next.js pages and routing
- Add Shadcn UI components
- Create sidebar, toolbar, status bar

**Day 9-12**: Phase 4 (Collaboration)
- Add presence tracking
- Implement live cursors
- Test multi-user editing

### Week 3: Refinement
**Day 13-15**: Phase 5 (Polish)
- Performance optimization
- Export to PDF
- Bug fixes and UX improvements

---

## Next Steps
You're ready to begin! Here's what happens next:

1. ✅ **You've set up the clean project structure**
2. 🔄 **I'll generate Phase 1 files** (Convex schema + TypeScript types)
3. ⏳ **You'll implement and test Phase 1**
4. 🔄 **I'll generate Phase 2 files** (TipTap editor)
5. ⏳ **Continue iterating through phases**

**Ready to start Phase 1?** Reply with "Begin Phase 1" and I'll generate all the Convex schema files and TypeScript types.
