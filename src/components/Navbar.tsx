import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function Navbar() {
  const session = await getSession();

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
              <Link href="/write" className="hover:text-foreground transition-colors">
                Написать
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
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
