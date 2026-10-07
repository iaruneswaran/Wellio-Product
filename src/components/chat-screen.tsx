import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  MessageSquare,
  PanelLeft,
  PenLine,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { createThread, loadThreads, saveThreads, type ChatThread } from "@/lib/chat-store";

const suggestions = [
  { label: "Find a fresh perspective", prompt: "Help me find a fresh perspective on my brand." },
  { label: "Put ideas into words", prompt: "Help me put my creative ideas into words." },
  { label: "Think through a project", prompt: "Help me think through a new design project." },
];
function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`font-display font-semibold ${small ? "text-xl" : "text-3xl"}`}>
      wrute<span className="text-ink-soft">.</span>
    </span>
  );
}

export function ChatScreen({ threadId }: { threadId?: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [ready, setReady] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    let stored = loadThreads();
    if (threadId && !stored.some((t) => t.id === threadId)) {
      stored = [{ ...createThread(), id: threadId }, ...stored];
      try {
        saveThreads(stored);
      } catch {
        setStorageError(true);
      }
    }
    setThreads(stored);
    setReady(true);
  }, [threadId]);
  useEffect(() => {
    textarea.current?.focus();
  }, [ready, threadId]);
  const active = threads.find((t) => t.id === threadId);
  const messages = active?.messages || [];
  function update(next: ChatThread[]) {
    try {
      saveThreads(next);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    setThreads(next);
  }
  function newChat() {
    const t = createThread();
    update([t, ...threads]);
    setSidebar(false);
    setDraft("");
    void navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }
  function send(text: string) {
    if (!text.trim()) return;
    const current = active || createThread();
    const user: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: text.trim() }],
    };
    const next = {
      ...current,
      title: current.messages.length ? current.title : text.trim().slice(0, 48),
      updatedAt: Date.now(),
      messages: [...current.messages, user],
    };
    update([next, ...threads.filter((t) => t.id !== current.id)]);
    setDraft("");
    if (!active) void navigate({ to: "/chat/$threadId", params: { threadId: current.id } });
    requestAnimationFrame(() => textarea.current?.focus());
  }
  function remove(id: string) {
    update(threads.filter((t) => t.id !== id));
    if (id === threadId) void navigate({ to: "/" });
  }
  function download() {
    if (!active) return;
    const text = active.messages
      .map(
        (m) =>
          `${m.role}: ${m.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("\n")}`,
      )
      .join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.title.replace(/[^a-z0-9]/gi, "-").slice(0, 48)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="chat-shell flex h-dvh min-h-0 bg-canvas text-foreground">
      {sidebar && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}
      <aside
        className={`chat-sidebar fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-border bg-surface-soft p-5 md:static md:w-64 lg:w-72 ${sidebar ? "flex" : "hidden md:flex"}`}
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <Link to="/" aria-label="Wrute home">
            <Brand />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            title="Close sidebar"
            aria-label="Close sidebar"
            className="md:hidden"
            onClick={() => setSidebar(false)}
          >
            <X />
          </Button>
          <span className="hidden border border-border px-2 py-1 text-[10px] font-semibold md:block">
            CHAT
          </span>
        </div>
        <Button
          variant="editorial"
          onClick={newChat}
          className="h-12 justify-between rounded-md px-4"
        >
          New conversation
          <PenLine />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setSearching(!searching)}
          className="mt-2 h-11 justify-start px-4 text-ink-soft"
        >
          <Search />
          Search conversations
        </Button>
        {searching && (
          <input
            autoFocus
            aria-label="Search conversations"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-foreground"
          />
        )}
        <div className="mt-9 flex items-center justify-between px-3 text-[10px] font-semibold uppercase text-ink-soft">
          <span>Conversations</span>
          <span>{String(threads.length).padStart(2, "0")}</span>
        </div>
        <nav aria-label="Conversations" className="mt-3 flex-1 space-y-1 overflow-y-auto">
          {threads
            .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
            .map((t) => (
              <div
                key={t.id}
                className={`group flex items-center rounded-md ${t.id === threadId ? "bg-card" : "hover:bg-card/60"}`}
              >
                <Button
                  asChild
                  variant="ghost"
                  className="h-11 min-w-0 flex-1 justify-start px-3 hover:bg-transparent"
                >
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    onClick={() => {
                      setSidebar(false);
                      setDraft("");
                    }}
                  >
                    <MessageSquare className="size-4 shrink-0 text-ink-soft" />
                    <span className="truncate text-xs">{t.title}</span>
                  </Link>
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Delete ${t.title}`}
                  title="Delete conversation"
                  className="mr-1 shrink-0 text-ink-soft md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  onClick={() => remove(t.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          {ready && !threads.length && (
            <p className="px-3 py-4 text-xs text-ink-soft">No conversations yet</p>
          )}
        </nav>
        <div className="mt-5 flex items-center gap-3 border-t border-border px-2 pt-5">
          <div className="flex size-9 items-center justify-center rounded-md bg-foreground font-display text-sm text-background">
            W
          </div>
          <div>
            <p className="text-sm font-semibold">Your workspace</p>
            <p className="mt-0.5 text-[11px] text-ink-soft">Personal · saved on this device</p>
          </div>
        </div>
      </aside>
      <section className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-5 sm:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open sidebar"
              title="Open sidebar"
              className="md:hidden"
              onClick={() => setSidebar(true)}
            >
              <PanelLeft />
            </Button>
            <Brand small />
            <span className="ml-3 hidden border-l border-border pl-4 text-xs text-ink-soft sm:block">
              A little space for big ideas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-[11px] text-ink-soft">
              <span className="size-1.5 rounded-full bg-ink-soft" />
              UI preview
            </span>
            {messages.length > 0 && (
              <Button
                size="icon"
                variant="ghost"
                title="Download conversation"
                aria-label="Download conversation"
                onClick={download}
              >
                <Download />
              </Button>
            )}
          </div>
        </header>
        {messages.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-6 py-10">
            <div className="w-full max-w-3xl pb-5">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-md bg-primary font-display text-2xl font-semibold">
                  w.
                </div>
                <span className="text-xs font-medium text-ink-soft">
                  YOUR NEXT IDEA STARTS HERE
                </span>
              </div>
              <h1 className="max-w-xl font-display text-4xl font-medium leading-[1.12] sm:text-5xl lg:text-6xl">
                What’s on
                <br />
                your mind<span className="text-ink-soft">?</span>
              </h1>
              <p className="mt-6 text-sm text-ink-soft sm:text-base">
                A blank page. A fresh thought. Something worth exploring.
              </p>
              <div className="mt-12 grid gap-3 sm:grid-cols-3">
                {suggestions.map((s, i) => (
                  <Button
                    key={s.label}
                    variant="editorialOutline"
                    onClick={() => {
                      setDraft(s.prompt);
                      textarea.current?.focus();
                    }}
                    className="h-auto min-h-28 flex-col items-start justify-between gap-6 whitespace-normal rounded-md border-border bg-card p-4 text-left hover:bg-primary hover:text-primary-foreground"
                  >
                    <span className="flex w-full items-center justify-between text-[10px] text-ink-soft">
                      <span>0{i + 1}</span>
                      <ArrowUpRight />
                    </span>
                    <span className="text-sm font-medium">{s.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Conversation className="min-h-0" key={threadId}>
            <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-5 py-10 sm:px-8">
              {messages.map((m) => (
                <Message key={m.id} from={m.role} className="max-w-full">
                  {m.role === "assistant" && (
                    <span className="font-display text-sm font-bold">wrute.</span>
                  )}
                  <MessageContent className="text-base leading-7 group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:rounded-md">
                    {m.parts.map((p, i) =>
                      p.type === "text" ? (
                        <MessageResponse key={i}>{p.text}</MessageResponse>
                      ) : null,
                    )}
                  </MessageContent>
                  <MessageActions className="justify-end">
                    <MessageAction
                      tooltip="Copy message"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            m.parts
                              .filter((p) => p.type === "text")
                              .map((p) => p.text)
                              .join("\n"),
                          );
                          setCopied(m.id);
                          setTimeout(() => setCopied(null), 1500);
                        } catch {
                          setCopied(null);
                        }
                      }}
                    >
                      {copied === m.id ? <Check /> : <Copy />}
                    </MessageAction>
                  </MessageActions>
                </Message>
              ))}
              <p className="text-sm text-ink-soft" role="status">
                Your message is saved. AI replies aren’t connected yet.
              </p>
            </ConversationContent>
            <ConversationScrollButton aria-label="Scroll to latest message" />
          </Conversation>
        )}
        <div className="shrink-0 px-5 pb-5 pt-3 sm:px-9 sm:pb-7">
          <div className="mx-auto max-w-3xl">
            <PromptInput onSubmit={({ text }) => send(text)} className="chat-composer">
              <PromptInputTextarea
                ref={textarea}
                autoFocus
                aria-label="Message Wrute"
                placeholder="Ask anything, or start with an idea…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="min-h-20 px-5 pt-5 text-base"
              />
              <PromptInputFooter className="justify-between px-4 pb-4">
                <span className="px-1 text-xs text-ink-soft">
                  {active ? "Keep the thought going" : "Make room for a new thought"}
                </span>
                <PromptInputSubmit
                  status="ready"
                  disabled={!draft.trim() || !ready}
                  aria-label="Send message"
                  className="size-10 shrink-0 rounded-md shadow-none"
                >
                  <ArrowUp className="size-5" />
                </PromptInputSubmit>
              </PromptInputFooter>
            </PromptInput>
            <div className="mt-3 flex items-center justify-between gap-3 px-1 text-[10px] text-ink-soft">
              <span>
                {storageError
                  ? "Unable to save. Check your browser storage."
                  : "Just you, your ideas, and a little possibility."}
              </span>
              <span className="shrink-0">WRUTE / CHAT</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
