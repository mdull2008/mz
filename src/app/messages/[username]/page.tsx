import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRelative, getInitials } from "@/lib/utils";
import MessageForm from "@/components/MessageForm";

type Params = Promise<{ username: string }>;

export default async function ConversationPage({ params }: { params: Params }) {
  const { username } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const other = await prisma.user.findUnique({ where: { username } });
  if (!other) notFound();

  await prisma.message.updateMany({
    where: {
      senderId: other.id,
      receiverId: session.id,
      read: false,
    },
    data: { read: true },
  });

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.id, receiverId: other.id },
        { senderId: other.id, receiverId: session.id },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { username: true, displayName: true } },
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/messages" className="text-muted hover:text-foreground text-sm">
          ← Назад
        </Link>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
          {getInitials(other.displayName)}
        </div>
        <div>
          <h1 className="font-semibold">{other.displayName}</h1>
          <Link href={`/profile/${other.username}`} className="text-xs text-muted hover:text-primary">
            @{other.username}
          </Link>
        </div>
      </div>

      <div className="flex-1 card space-y-3 mb-4 overflow-y-auto max-h-[60vh]">
        {messages.length === 0 ? (
          <p className="text-center text-muted text-sm py-8">
            Начните переписку с {other.displayName}
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === session.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-card-hover border border-border rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${isMine ? "text-white/70" : "text-muted"}`}
                  >
                    {formatRelative(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageForm receiverUsername={other.username} />
    </div>
  );
}
