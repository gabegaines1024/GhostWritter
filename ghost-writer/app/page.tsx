/**
 * Home Page - MonkeyType-inspired design
 *
 * Dark, minimal, focused interface for managing scripts.
 */

"use client";

import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../convex/_generated/api";

export default function Home() {
  const router = useRouter();
  const scripts = useQuery(api.scripts.list);
  const createScript = useMutation(api.scripts.create);

  const handleScriptClick = (scriptId: string) => {
    router.push(`/scripts/${scriptId}`);
  };

  const handleCreateNew = async () => {
    try {
      const scriptId = await createScript({
        title: "Untitled Screenplay",
        author: "Anonymous",
      });
      router.push(`/scripts/${scriptId}`);
    } catch (error) {
      console.error("Failed to create script:", error);
    }
  };

  const isLoading = scripts === undefined;

  // Calculate stats
  const totalScripts = scripts?.length ?? 0;
  const totalWords = 0; // TODO: Calculate from blocks
  const totalPages = Math.ceil(totalWords / 250);
  const recentActivity = scripts?.[0]
    ? formatRelativeTime(scripts[0].updatedAt)
    : "—";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="ghost-container">
        <div className="ghost-header">
          <div className="ghost-logo">
            <span className="ghost-logo-accent">ghost</span>writer
          </div>
          <nav className="ghost-nav">
            <a href="#" className="ghost-nav-link active">
              scripts
            </a>
            <a href="#" className="ghost-nav-link">
              settings
            </a>
            <a href="#" className="ghost-nav-link">
              about
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="ghost-container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
            Write your story.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-md mx-auto">
            Professional screenwriting with real-time collaboration.
            <br />
            <span className="text-[var(--text-muted)]">
              Industry-standard formatting, zero friction.
            </span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid mb-16 animate-slide-up">
          <div className="stat-item">
            <div className="stat-value">{totalScripts}</div>
            <div className="stat-label">Scripts</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalPages}</div>
            <div className="stat-label">Pages</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalWords.toLocaleString()}</div>
            <div className="stat-label">Words</div>
          </div>
          <div className="stat-item">
            <div className="stat-value text-xl">{recentActivity}</div>
            <div className="stat-label">Last Active</div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Your Scripts
          </h2>
          <div className="text-xs text-[var(--text-muted)]">
            <kbd className="kbd">⌘</kbd> + <kbd className="kbd">N</kbd> new
            script
          </div>
        </div>

        {/* Scripts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create New Card */}
          <button
            onClick={handleCreateNew}
            className="ghost-card-new animate-slide-up stagger-1"
          >
            <span className="ghost-card-new-icon">+</span>
            <span className="text-sm text-[var(--text-secondary)]">
              New Script
            </span>
          </button>

          {/* Loading State */}
          {isLoading &&
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`ghost-card animate-slide-up stagger-${i + 2} opacity-50`}
                style={{ minHeight: "180px" }}
              >
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2 mb-8"></div>
                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/3"></div>
              </div>
            ))}

          {/* Script Cards */}
          {scripts?.map((script, index) => (
            <button
              key={script._id}
              onClick={() => handleScriptClick(script._id)}
              className={`ghost-card text-left animate-slide-up stagger-${Math.min(index + 2, 6)}`}
              style={{ minHeight: "180px" }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                    {script.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    by {script.author}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{formatRelativeTime(script.updatedAt)}</span>
                  <span className="text-[var(--accent-primary)]">→</span>
                </div>
              </div>
            </button>
          ))}

          {/* Empty State */}
          {scripts?.length === 0 && (
            <div className="col-span-full text-center py-16 text-[var(--text-secondary)]">
              <p className="mb-2">No scripts yet.</p>
              <p className="text-sm text-[var(--text-muted)]">
                Click "New Script" to start writing.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="ghost-container py-8 mt-16 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span>ghostwriter v0.1</span>
            <span>•</span>
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">
              github
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>
              <kbd className="kbd">?</kbd> shortcuts
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Format timestamp to relative time
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
