import { useState, useEffect } from "react";
import { ChevronRight, LayoutGrid, List, Search } from "lucide-react";
import { PLATFORMS_DATA, type AgentCategoryItem, type PlatformItem } from "@/lib/agents-data";

interface AgentPlatformSelectorProps {
  activePlatformId: string;
  onSelectPlatform: (platformId: string) => void;
  onSelectAgent: (
    platform: PlatformItem,
    agent: AgentCategoryItem,
    initialQuestion?: string,
  ) => void;
}

export function AgentPlatformSelector({
  activePlatformId,
  onSelectPlatform,
  onSelectAgent,
}: AgentPlatformSelectorProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wellio-agents-view-mode");
      if (saved === "list" || saved === "grid") return saved;
    }
    return "grid";
  });

  useEffect(() => {
    try {
      localStorage.setItem("wellio-agents-view-mode", viewMode);
    } catch {
      // ignore local storage errors
    }
  }, [viewMode]);

  const fallbackPlatform: PlatformItem = PLATFORMS_DATA[0] as PlatformItem;
  const activePlatform: PlatformItem =
    PLATFORMS_DATA.find((p) => p.id === activePlatformId) ?? fallbackPlatform;

  const filteredAgents = activePlatform.agents.filter((agent) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      agent.category.toLowerCase().includes(query) ||
      agent.whatUsersCanAsk.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      {/* Frozen Platform Selection Header: GoodDoc HMS (14), GoodDoc Kiosk (12), A Style (11) + Search */}
      <div className="shrink-0 border-b border-border/60 bg-white px-5 py-4 sm:px-9 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Platform selection"
            className="flex flex-row items-center gap-3 overflow-x-auto pb-1 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {PLATFORMS_DATA.map((platform) => {
              const isSelected = platform.id === activePlatform.id;

              return (
                <button
                  key={platform.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectPlatform(platform.id)}
                  className={`group inline-flex h-[48px] shrink-0 cursor-pointer items-center rounded-[4px] border px-5 text-left transition-all duration-150 ${
                    isSelected
                      ? "border-foreground bg-foreground text-background shadow-xs"
                      : "border-border bg-white text-ink-soft hover:border-foreground/40 hover:bg-surface-soft hover:text-foreground"
                  }`}
                >
                  <span
                    className={`font-display text-sm font-semibold transition-colors ${
                      isSelected ? "text-background" : "text-ink-soft group-hover:text-foreground"
                    }`}
                  >
                    {platform.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search & View Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
              <input
                type="text"
                aria-label={`Search ${activePlatform.name} agents`}
                placeholder="Search agents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-[48px] w-full rounded-[4px] border border-border bg-card pl-10 pr-3.5 text-sm outline-none transition-colors placeholder:text-ink-soft/70 focus:border-foreground"
              />
            </div>

            {/* View Mode Toggle: Cards (Grid) vs List */}
            <div
              role="group"
              aria-label="View mode toggle"
              className="flex h-[48px] shrink-0 items-center rounded-[4px] border border-border bg-card p-1"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Cards view"
                aria-pressed={viewMode === "grid"}
                title="Cards view"
                className={`flex h-full w-[38px] items-center justify-center rounded-[4px] transition-colors ${
                  viewMode === "grid"
                    ? "bg-surface-soft font-medium text-foreground shadow-2xs"
                    : "text-ink-soft hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                title="List view"
                className={`flex h-full w-[38px] items-center justify-center rounded-[4px] transition-colors ${
                  viewMode === "list"
                    ? "bg-surface-soft font-medium text-foreground shadow-2xs"
                    : "text-ink-soft hover:text-foreground"
                }`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Directory Container: Only the agents section scrolls, with scrollbar hidden */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-9 sm:py-7 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {filteredAgents.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-[4px] border border-border bg-card text-sm text-ink-soft">
            No agents found matching "{search}".
          </div>
        ) : viewMode === "grid" ? (
          /* Cards Grid View - Previous full width with single arrow and clean typography */
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => {
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => onSelectAgent(activePlatform, agent)}
                  className="group flex flex-col justify-between rounded-[4px] border border-border bg-card p-5.5 text-left transition-all hover:border-foreground/50 hover:bg-surface-soft/60 hover:shadow-xs sm:p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-[17px] font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-foreground sm:text-lg">
                        {agent.category}
                      </h3>
                      <ChevronRight className="mt-1 size-4.5 shrink-0 text-ink-soft opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-foreground" />
                    </div>

                    <p className="mt-3 text-sm leading-[1.6] text-ink-soft">
                      {agent.whatUsersCanAsk}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* High-Density List View */
          <div className="divide-y divide-border/60 rounded-[4px] border border-border bg-card">
            {filteredAgents.map((agent) => {
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => onSelectAgent(activePlatform, agent)}
                  className="group flex w-full items-center justify-between gap-6 p-5 text-left transition-colors hover:bg-surface-soft/60 sm:px-6 sm:py-5"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-foreground sm:text-[17px]">
                      {agent.category}
                    </h3>
                    <p className="mt-1.5 text-sm leading-[1.6] text-ink-soft">
                      {agent.whatUsersCanAsk}
                    </p>
                  </div>

                  <ChevronRight className="size-5 shrink-0 text-ink-soft opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-foreground" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
