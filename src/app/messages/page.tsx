import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRelative, getInitials } from "@/lib/utils";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: session.id }, { receiverId: session.id }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, username: true, displayName: true } },
      receiver: { select: { id: true, username: true, displayName: true } },
    },
  });

  const conversations = new Map<
    string,
    {
      user: { username: string; displayName: string };
      lastMessage: string;
      lastDate: Date;
      unread: number;
    }
  >();

  for (const msg of messages) {
    const other =
      msg.senderId === session.id ? msg.receiver : msg.sender;
    const key = other.username;

    if (!conversations.has(key)) {
      conversations.set(key, {
        user: other,
        lastMessage: msg.content,
        lastDate: msg.createdAt,
        unread:
          msg.receiverId === session.id && !msg.read ? 1 : 0,
      });
    } else if (msg.receiverId === session.id && !msg.read) {
      const conv = conversations.get(key)!;
      conv.unread += 1;
    }
  }

  const list = Array.from(conversations.values()).sort(
    (a, b) => b.lastDate.getTime() - a.lastDate.getTime()
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Сообщения</h1>

      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="card text-center text-muted py-12">
            Нет сообщений. Напишите автору с его профиля.
          </div>
        ) : (
          list.map((conv) => (
            <Link
              key={conv.user.username}
              href={`/messages/${conv.user.username}`}
              className="card flex items-center gap-4 hover:bg-card-hover transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold shrink-0">
                {getInitials(conv.user.displayName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{conv.user.displayName}</span>
                  <span className="text-xs text-muted shrink-0">
                    {formatRelative(conv.lastDate)}
                  </span>
                </div>
                <p className="text-sm text-muted truncate mt-0.5">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                  {conv.unread}
                </span>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
