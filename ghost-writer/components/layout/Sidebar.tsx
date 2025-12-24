/**
 * Sidebar Component
 *
 * Left sidebar with scene navigator and formatting tools.
 */

"use client";

export interface SidebarProps {
  scriptId: string;
  scenes?: Array<{
    id: string;
    heading: string;
    blockId: string;
  }>;
  onSceneClick?: (blockId: string) => void;
}

export function Sidebar({ scriptId, scenes = [], onSceneClick }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="font-semibold">Scenes</h2>
        <p className="text-xs text-muted-foreground">Script: {scriptId}</p>
      </div>

      {/* Scene List */}
      <nav className="flex-1 overflow-auto p-2">
        {scenes.length === 0 ? (
          <p className="p-2 text-sm text-muted-foreground">
            No scenes yet. Start writing!
          </p>
        ) : (
          <ul className="space-y-1">
            {scenes.map((scene, index) => (
              <li key={scene.id}>
                <button
                  onClick={() => onSceneClick?.(scene.blockId)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="font-medium">{index + 1}.</span>{" "}
                  <span className="text-muted-foreground">{scene.heading}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          {scenes.length} scene{scenes.length !== 1 ? "s" : ""}
        </p>
      </div>
    </aside>
  );
}

