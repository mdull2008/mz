import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRelative } from "@/lib/utils";
import { markNotificationsReadAction } from "@/lib/actions";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: { select: { username: true, displayName: true } },
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Уведомления</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted mt-1">{unreadCount} непрочитанных</p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action={markNotificationsReadAction}>
            <button type="submit" className="btn-secondary text-sm">
              Прочитать все
            </button>
          </form>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="card text-center text-muted py-12">
            Пока нет уведомлений
          </div>
        ) : (
          notifications.map((notif) => (
            <Link
              key={notif.id}
              href={notif.link || "/notifications"}
              className={`card block hover:bg-card-hover transition-colors ${!notif.read ? "border-primary/50 bg-primary/5" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">
                  {notif.type === "follow" && "👤"}
                  {notif.type === "like_post" && "♥"}
                  {notif.type === "like_story" && "📖"}
                  {notif.type === "comment" && "💬"}
                  {notif.type === "message" && "✉️"}
                  {notif.type === "new_chapter" && "📝"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-muted mt-1">{formatRelative(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
