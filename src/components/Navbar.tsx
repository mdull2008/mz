import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { getUnreadNotificationCount, getUnreadMessageCount } from "@/lib/notifications";

export default async function Navbar() {
  const session = await getSession();

  let unreadNotifs = 0;
  let unreadMessages = 0;
  if (session) {
    [unreadNotifs, unreadMessages] = await Promise.all([
      getUnreadNotificationCount(session.id),
      getUnreadMessageCount(session.id),
    ]);
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold gradient-text">
            FicPulse
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted">
            <Link href="/feed" className="hover:text-foreground transition-colors">
              Лента
            </Link>
            <Link href="/stories" className="hover:text-foreground transition-colors">
              Фанфики
            </Link>
            {session && (
              <>
                <Link href="/write" className="hover:text-foreground transition-colors">
                  Написать
                </Link>
                <Link href="/messages" className="hover:text-foreground transition-colors">
                  Сообщения
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl hover:bg-card transition-colors"
                title="Уведомления"
              >
                <span className="text-lg">🔔</span>
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                  </span>
                )}
              </Link>
              <Link
                href="/messages"
                className="relative p-2 rounded-xl hover:bg-card transition-colors sm:hidden"
                title="Сообщения"
              >
                <span className="text-lg">✉️</span>
                {unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </Link>
              <Link
                href="/messages"
                className="relative hidden sm:flex items-center gap-1 text-sm text-muted hover:text-foreground"
              >
                ✉️
                {unreadMessages > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </Link>
              <Link
                href={`/profile/${session.username}`}
                className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
              >
                @{session.username}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="btn-secondary text-sm py-1.5">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm py-1.5">
                Войти
              </Link>
              <Link href="/register" className="btn-primary text-sm py-1.5">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
