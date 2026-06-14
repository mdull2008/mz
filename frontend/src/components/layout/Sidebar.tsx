import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getAvatar } from '../../lib/utils';

const NAV = [
  { to: '/', icon: '🏠', label: 'Главная' },
  { to: '/explore', icon: '🔍', label: 'Поиск' },
  { to: '/library', icon: '📚', label: 'Библиотека' },
  { to: '/notifications', icon: '🔔', label: 'Уведомления' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const loc = useLocation();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col p-4 border-r border-white/5 bg-surface-950 z-40">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-4">
        <span className="text-2xl">📖</span>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-300 bg-clip-text text-transparent">
          FicSpace
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              loc.pathname === to
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}

        {user && (
          <>
            <Link
              to={`/u/${user.username}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                loc.pathname === `/u/${user.username}`
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
              }`}
            >
              <span className="text-xl">👤</span>
              <span>Профиль</span>
            </Link>

            {user.is_writer === 1 && (
              <Link
                to="/write"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  loc.pathname === '/write'
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
              >
                <span className="text-xl">✍️</span>
                <span>Написать</span>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* New Post Button */}
      {user && (
        <div className="mb-4">
          <Link to="/?compose=1" className="btn-primary w-full text-center block py-3 text-sm">
            ✨ Новый пост
          </Link>
        </div>
      )}

      {/* User card */}
      {user ? (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <img
            src={getAvatar(user)}
            alt={user.display_name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-600/50"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{user.display_name}</p>
            <p className="text-xs text-gray-500 truncate">@{user.username}</p>
          </div>
          <button
            onClick={logout}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all text-xs"
            title="Выйти"
          >
            ↩
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Link to="/login" className="btn-secondary w-full text-center block py-2.5 text-sm">
            Войти
          </Link>
          <Link to="/register" className="btn-primary w-full text-center block py-2.5 text-sm">
            Регистрация
          </Link>
        </div>
      )}
    </aside>
  );
}
