import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import {
  ArrowUp,
  Check,
  Copy,
  Download,
  MessageSquare,
  PanelLeft,
  Paperclip,
  PenLine,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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

function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`font-display font-semibold ${small ? "text-xl" : "text-3xl"}`}>
      wellio<span className="text-ink-soft">.</span>
    </span>
  );
}

function generateAnswer(query: string): string {
  const q = query.trim().toLowerCase();
  if (/^(hi|hello|hey|sup|good morning|good afternoon|good evening)\b/i.test(q)) {
    return "Hello! I'm Wellio. How can I help you explore your ideas or work on your project today?";
  }
  if (/^(what can you do|who are you|help)\b/i.test(q)) {
    return "I'm Wellio, your creative workspace assistant. I can help you brainstorm concepts, refine writing, explore fresh angles, and organize your thoughts into clear, actionable plans.";
  }
  if (/brand|perspective|idea|design|project|strategy/i.test(q)) {
    return `Here are a few clear insights on "${query.trim()}":\n\n1. **Core Clarity**: Strip back unnecessary complexity and focus on the primary message you want to communicate.\n2. **Target Audience**: Frame your perspective around the exact need or curiosity of your audience.\n3. **Actionable Direction**: Prototype the simplest version first to test and iterate rapidly.\n\nWhat specific angle would you like to dive into next?`;
  }
  return `Here is a perspective on "${query.trim()}":\n\n• **Core Concept**: Focus on the most impactful element and refine it for clarity.\n• **Execution**: Break down the process into small, manageable milestones.\n• **Refinement**: Eliminate friction and let the strongest ideas stand out.\n\nLet me know how you'd like to take this forward!`;
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
  const [isThinking, setIsThinking] = useState(false);
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [waveBars, setWaveBars] = useState<number[]>(() => new Array(68).fill(3));

  useEffect(() => {
    return () => {
      if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {}
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isListening) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {}
        audioContextRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setWaveBars(new Array(68).fill(3));
      return;
    }

    let isCancelled = false;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (isCancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          micStreamRef.current = stream;
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioCtx) return;

          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.5;

          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateWave = () => {
            if (isCancelled) return;
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i] ?? 0;
            }
            const avg = sum / dataArray.length;
            const norm = Math.min(1, avg / 35);

            const nextBars = new Array(68).fill(3);
            if (norm > 0.05) {
              const time = Date.now() / 120;
              for (let i = 0; i < 68; i++) {
                const wave1 = Math.sin((i / 68) * Math.PI * 3 + time);
                const wave2 = Math.cos((i / 68) * Math.PI * 4 - time * 0.7);
                const packet = Math.max(0, wave1 * wave2);
                const barHeight = 3 + packet * norm * 26;
                nextBars[i] = Math.max(3, Math.min(26, Math.round(barHeight)));
              }
            }
            setWaveBars(nextBars);
            animFrameRef.current = requestAnimationFrame(updateWave);
          };

          updateWave();
        })
        .catch(() => {
          runSimulation();
        });
    } else {
      runSimulation();
    }

    function runSimulation() {
      let step = 0;
      fallbackInterval = setInterval(() => {
        if (isCancelled) return;
        step += 1;
        const isSpeaking = step % 9 < 6;
        const nextBars = new Array(68).fill(3);
        if (isSpeaking) {
          const center1 = (Math.sin(step * 0.35) * 0.3 + 0.38) * 68;
          const center2 = (Math.cos(step * 0.28) * 0.2 + 0.72) * 68;
          for (let i = 0; i < 68; i++) {
            const d1 = Math.abs(i - center1);
            const d2 = Math.abs(i - center2);
            const g1 = Math.exp(-(d1 * d1) / 16) * 24;
            const g2 = Math.exp(-(d2 * d2) / 14) * 20;
            const val = 3 + Math.max(g1, g2) * (0.65 + Math.random() * 0.35);
            nextBars[i] = Math.max(3, Math.min(26, Math.round(val)));
          }
        }
        setWaveBars(nextBars);
      }, 85);
    }

    return () => {
      isCancelled = true;
      if (fallbackInterval) clearInterval(fallbackInterval);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {}
        audioContextRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isListening]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...files]);
    }
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleListening() {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    setIsListening(true);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setDraft((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setDraft((prev) => (prev ? prev : "Voice note: brainstorm project ideas"));
        setIsListening(false);
      }, 4000);
    }
  }
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
  const active = threads.find((t) => t.id === threadId);
  const messages = active?.messages || [];
  useEffect(() => {
    textarea.current?.focus();
  }, [ready, threadId, messages.length]);
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
    setAttachments([]);
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    void navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }
  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    const attachmentNote = attachments.length
      ? `\n\n[Attached: ${attachments.map((f) => f.name).join(", ")}]`
      : "";
    const fullText = (trimmed || "Uploaded attachment(s)") + attachmentNote;
    const current = active || createThread();
    const user: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: fullText }],
    };
    const threadWithUser = {
      ...current,
      title: current.messages.length ? current.title : (trimmed || "Attachment").slice(0, 48),
      updatedAt: Date.now(),
      messages: [...current.messages, user],
    };
    update([threadWithUser, ...threads.filter((t) => t.id !== current.id)]);
    setDraft("");
    setAttachments([]);
    if (!active) void navigate({ to: "/chat/$threadId", params: { threadId: current.id } });

    setIsThinking(true);
    if (thinkingTimer.current) clearTimeout(thinkingTimer.current);

    thinkingTimer.current = setTimeout(() => {
      const assistant: UIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [{ type: "text", text: generateAnswer(trimmed) }],
      };
      const threadWithAssistant = {
        ...threadWithUser,
        updatedAt: Date.now(),
        messages: [...threadWithUser.messages, assistant],
      };
      update([threadWithAssistant, ...threads.filter((t) => t.id !== current.id)]);
      setIsThinking(false);
    }, 1200);

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
  const canSend = Boolean(draft.trim() || attachments.length > 0);

  const renderComposer = () => (
    <div className="w-full">
      <motion.div
        initial={false}
        animate={{
          height: isListening ? 50 : 120,
          borderRadius: isListening ? 25 : 12,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="chat-card relative w-full overflow-hidden border border-border bg-card shadow-xs"
        style={{ willChange: "height, border-radius" }}
      >
        {/* Voice recording listening bar view */}
        <motion.div
          key="voice-bar-view"
          initial={false}
          animate={{
            opacity: isListening ? 1 : 0,
            scale: isListening ? 1 : 0.98,
            pointerEvents: isListening ? "auto" : "none",
          }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="absolute inset-0 flex h-full w-full items-center justify-between px-3.5"
          aria-hidden={!isListening}
        >
          <div className="flex h-full flex-1 items-center justify-center overflow-hidden pr-2">
            <div className="flex w-full items-center justify-between gap-[3px]">
              {waveBars.map((height, idx) => (
                <span
                  key={idx}
                  className={`w-[2.5px] rounded-full transition-all duration-75 ${
                    height > 4 ? "bg-foreground" : "bg-ink-soft/30"
                  }`}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleListening}
            title="Stop recording"
            aria-label="Stop recording"
            className="ml-3 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-primary bg-primary/20 shadow-xs transition-transform hover:scale-105 hover:bg-primary/30 active:scale-95"
          >
            <div className="size-3 rounded-[2.5px] bg-foreground shadow-xs" />
          </button>
        </motion.div>

        {/* Normal typing composer view */}
        <motion.div
          key="normal-typing-view"
          initial={false}
          animate={{
            opacity: isListening ? 0 : 1,
            scale: isListening ? 0.98 : 1,
            pointerEvents: isListening ? "none" : "auto",
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex h-[120px] w-full flex-col justify-between"
          aria-hidden={isListening}
        >
          <PromptInput onSubmit={({ text }) => send(text)} className="chat-composer flex h-full flex-col justify-between border-0 bg-transparent shadow-none">
            <PromptInputTextarea
              ref={textarea}
              autoFocus
              aria-label="Message Wellio"
              placeholder="Message Wellio…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-0 flex-1 resize-none border-0 bg-transparent px-5 pt-3 text-base shadow-none focus-visible:ring-0"
            />

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 px-5 pb-1">
                {attachments.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface-soft px-2.5 py-1 text-xs text-foreground"
                  >
                    <Paperclip className="size-3 text-ink-soft" />
                    <span className="max-w-[140px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="cursor-pointer text-ink-soft hover:text-foreground"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <PromptInputFooter className="mt-auto flex items-center justify-between border-0 bg-transparent px-3 pb-2 pt-0">
              {/* Left side: Attach option */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-surface-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  title="Attach file"
                  aria-label="Attach file"
                >
                  <Paperclip className="size-4.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Right side: Wave button when empty, Sent button when typing */}
              <div className="flex items-center">
                <AnimatePresence mode="wait">
                  {canSend ? (
                    <motion.div
                      key="send-option-btn"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <PromptInputSubmit
                        status={isThinking ? "submitted" : "ready"}
                        disabled={!canSend || !ready}
                        aria-label="Send message"
                        className="size-10 shrink-0 rounded-md shadow-none"
                      >
                        <ArrowUp className="size-5" />
                      </PromptInputSubmit>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="wave-btn"
                      type="button"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={toggleListening}
                      title="Voice input"
                      aria-label="Voice input"
                      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-surface-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <div className="flex h-5 items-center justify-center gap-[2.5px]" aria-hidden="true">
                        <span className="h-[6px] w-[2.5px] rounded-full bg-ink-soft" />
                        <span className="h-[12px] w-[2.5px] rounded-full bg-ink-soft" />
                        <span className="h-[18px] w-[2.5px] rounded-full bg-ink-soft" />
                        <span className="h-[12px] w-[2.5px] rounded-full bg-ink-soft" />
                        <span className="h-[6px] w-[2.5px] rounded-full bg-ink-soft" />
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </PromptInputFooter>
          </PromptInput>
        </motion.div>
      </motion.div>
      {storageError && (
        <p role="alert" className="mt-3 px-1 text-xs text-alert">
          Unable to save. Check your browser storage.
        </p>
      )}
    </div>
  );

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
        <div className="mb-8 flex items-center justify-between px-2">
          <Link to="/" aria-label="Wellio home">
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
        </div>
        <Button
          variant="editorial"
          onClick={newChat}
          className="h-12 justify-between rounded-md px-4"
        >
          New chat
          <PenLine />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setSearching(!searching)}
          className="mt-2 h-11 justify-start px-4 text-ink-soft"
        >
          <Search />
          Search chats
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
        <div className="mt-8 px-3 text-xs font-medium text-ink-soft">
          <span>Recent chats</span>
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
      </aside>
      <section className="relative flex min-w-0 flex-1 flex-col bg-white">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 px-5 sm:px-9">
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
            <span className="md:hidden"><Brand small /></span>
            <span className="hidden truncate text-sm text-ink-soft md:block">
              {active?.title || "New chat"}
            </span>
          </div>
          <div className="flex items-center gap-2">
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
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 sm:px-9">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-3xl -translate-y-4 sm:-translate-y-8"
            >
              <h1 className="mb-8 whitespace-nowrap font-display text-[58px] font-medium leading-[1.1] tracking-tight">
                What’s on your mind<span className="text-ink-soft">?</span>
              </h1>
              {renderComposer()}
            </motion.div>
          </div>
        ) : (
          <>
            <Conversation className="min-h-0" key={threadId}>
              <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-5 py-10 sm:px-8">
                {messages.map((m) => (
                  <Message key={m.id} from={m.role} className="max-w-full">
                    {m.role === "assistant" && (
                      <span className="font-display text-sm font-bold">wellio.</span>
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
                {isThinking && (
                  <div className="flex flex-col gap-2 max-w-full">
                    <span className="font-display text-sm font-bold">wellio.</span>
                    <div className="flex items-center gap-1.5 py-2 px-1" role="status" aria-label="Loading response">
                      <motion.span
                        className="size-2 rounded-full bg-foreground/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.span
                        className="size-2 rounded-full bg-foreground/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15, ease: "easeInOut" }}
                      />
                      <motion.span
                        className="size-2 rounded-full bg-foreground/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton aria-label="Scroll to latest message" />
            </Conversation>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="shrink-0 px-5 pb-5 pt-3 sm:px-9 sm:pb-7"
            >
              <div className="mx-auto max-w-3xl">
                {renderComposer()}
              </div>
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}
