import { createFileRoute } from "@tanstack/react-router";
import { ChatScreen } from "@/components/chat-screen";
import { chatMeta } from "@/lib/chat-store";
export const Route = createFileRoute("/")({
  head: () =>
    chatMeta(
      "Wellio Chat — A space for your ideas",
      "A light, thoughtful conversation workspace from Wellio. Start an idea and keep your conversations together.",
    ),
  component: ChatHome,
});
function ChatHome() {
  return <ChatScreen />;
}
