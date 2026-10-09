import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
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

  const activePlatform = PLATFORMS_DATA.find((p) => p.id === activePlatformId) ?? PLATFORMS_DATA[0];

  const filteredAgents = activePlatform.agents.filter((agent) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      agent.category.toLowerCase().includes(query) ||
      agent.whatUsersCanAsk.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-5 py-6 sm:px-9 sm:py-8">
      {/* 3 Horizontal Platform Cards: Left Side, Top, Single Line */}
      <div className="mb-7 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Platform selection"
            className="flex flex-row items-center gap-3 overflow-x-auto pb-1 scrollbar-none"
          >
            {PLATFORMS_DATA.map((platform) => {
              const isSelected = platform.id === activePlatform.id;

              return (
                <button
                  key={platform.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectPlatform(platform.id)}
                  className={`group inline-flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-left transition-all ${
                    isSelected
                      ? "border-foreground bg-card shadow-xs ring-1 ring-foreground/20"
                      : "border-border bg-card/60 text-ink-soft hover:border-foreground/30 hover:bg-surface-soft hover:text-foreground"
                  }`}
                >
                  <span className="font-display text-sm font-semibold text-foreground">
                    {platform.name}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      isSelected
                        ? "bg-surface-soft text-foreground"
                        : "bg-surface-soft text-ink-soft"
                    }`}
                  >
                    {platform.agents.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              aria-label={`Search ${activePlatform.name} agents`}
              placeholder="Search agents…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-ink-soft/70 focus:border-foreground"
            />
          </div>
        </div>
      </div>

      {/* Agents Directory Grid: No icons, Larger Heading & Secondary Font */}
      <div className="min-h-0 flex-1">
        {filteredAgents.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card text-sm text-ink-soft">
            No agents found matching "{search}".
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => {
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => onSelectAgent(activePlatform, agent)}
                  className="group flex flex-col justify-between rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-foreground/50 hover:bg-surface-soft/60 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground">
                        {agent.category}
                      </h3>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {agent.whatUsersCanAsk}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-ink-soft">
                    <span>{activePlatform.shortName}</span>
                    <span className="font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      Open chat →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
