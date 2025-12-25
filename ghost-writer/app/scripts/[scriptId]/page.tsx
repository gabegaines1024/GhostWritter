/**
 * Script Editor Page
 *
 * This page displays the TipTap editor for a specific script.
 * Includes Sidebar, Toolbar, StatusBar, and the main editor.
 */

import { ScriptEditorClient } from "./ScriptEditorClient";

interface ScriptEditorPageProps {
  params: Promise<{
    scriptId: string;
  }>;
}

export default async function ScriptEditorPage({
  params,
}: ScriptEditorPageProps) {
  const { scriptId } = await params;

  return <ScriptEditorClient scriptId={scriptId} />;
}
