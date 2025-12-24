/**
 * Script Editor Page
 *
 * This page displays the TipTap editor for a specific script.
 * It will include the Sidebar, Toolbar, StatusBar, and the main editor.
 */

interface ScriptEditorPageProps {
  params: Promise<{
    scriptId: string;
  }>;
}

export default async function ScriptEditorPage({
  params,
}: ScriptEditorPageProps) {
  const { scriptId } = await params;

  return (
    <div className="flex h-screen flex-col">
      {/* TODO: Add Toolbar component */}
      <header className="border-b px-4 py-2">
        <h1 className="text-lg font-semibold">Script Editor</h1>
        <p className="text-sm text-muted-foreground">Script ID: {scriptId}</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* TODO: Add Sidebar component */}
        <aside className="w-64 border-r p-4">
          <p className="text-sm text-muted-foreground">Scene Navigator</p>
        </aside>

        {/* TODO: Add TipTapEditor component */}
        <main className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-muted-foreground">
              Editor will be rendered here.
            </p>
          </div>
        </main>
      </div>

      {/* TODO: Add StatusBar component */}
      <footer className="border-t px-4 py-2 text-sm text-muted-foreground">
        Page 1 | Words: 0 | Characters: 0
      </footer>
    </div>
  );
}

