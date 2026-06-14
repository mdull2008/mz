import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface Props { mode: 'login' | 'register'; }

export default function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ login: '', username: '', display_name: '', email: '', password: '', is_writer: false });

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.login, form.password);
      } else {
        await register({ username: form.username, display_name: form.display_name, email: form.email, password: form.password, is_writer: form.is_writer });
      }
      toast.success(mode === 'login' ? 'Добро пожаловать!' : 'Аккаунт создан!');
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Ошибка';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left: decorative */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-primary-950 via-purple-950 to-surface-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #7c4dff 0%, transparent 50%), radial-gradient(circle at 80% 70%, #a855f7 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center max-w-md">
          <div className="text-6xl mb-6">📖</div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            FicSpace
          </h1>
          <p className="text-purple-300 text-lg leading-relaxed mb-8">
            Место где авторы пишут миры, а читатели в них живут.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[['📝', 'Пиши фанфики'], ['❤️', 'Находи любимое'], ['💬', 'Общайся']].map(([icon, label]) => (
              <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-purple-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-300 bg-clip-text text-transparent">FicSpace</span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            {mode === 'login' ? 'Добро пожаловать!' : 'Создать аккаунт'}
          </h2>
          <p className="text-gray-500 mb-8">
            {mode === 'login' ? 'Войдите, чтобы продолжить' : 'Присоединяйтесь к сообществу'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Логин или email</label>
                <input value={form.login} onChange={e => set('login', e.target.value)} required className="input-field" placeholder="@username или email" />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Имя пользователя</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <input value={form.username} onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} required className="input-field pl-8" placeholder="username" minLength={3} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Отображаемое имя</label>
                  <input value={form.display_name} onChange={e => set('display_name', e.target.value)} required className="input-field" placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                  <input value={form.email} onChange={e => set('email', e.target.value)} required type="email" className="input-field" placeholder="you@example.com" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Пароль</label>
              <input value={form.password} onChange={e => set('password', e.target.value)} required type="password" className="input-field" placeholder="Минимум 6 символов" minLength={6} />
            </div>

            {mode === 'register' && (
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Я регистрируюсь как:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[{ v: false, icon: '📚', label: 'Читатель', desc: 'Читаю и комментирую' },
                    { v: true, icon: '✍️', label: 'Автор', desc: 'Пишу произведения' }].map(opt => (
                    <button key={String(opt.v)} type="button" onClick={() => set('is_writer', opt.v)}
                      className={`p-4 rounded-xl border text-left transition-all ${form.is_writer === opt.v ? 'bg-primary-600/20 border-primary-500/50 text-primary-300' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}>
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs opacity-70">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? (
              <>Нет аккаунта? <Link to="/register" className="text-primary-400 hover:underline">Зарегистрироваться</Link></>
            ) : (
              <>Уже есть аккаунт? <Link to="/login" className="text-primary-400 hover:underline">Войти</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
