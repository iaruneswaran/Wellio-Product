import { createFileRoute } from "@tanstack/react-router";
import { ChatScreen } from "@/components/chat-screen";
import { chatMeta } from "@/lib/chat-store";
export const Route = createFileRoute("/chat/$threadId")({
  head: () =>
    chatMeta(
      "Your conversation — Wellio Chat",
      "Your personal Wellio conversation workspace, with chats saved on this device.",
    ),
  component: ThreadPage,
});
function ThreadPage() {
  const { threadId } = Route.useParams();
  return <ChatScreen key={threadId} threadId={threadId} />;
}
