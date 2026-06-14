import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StoryCard from '../components/story/StoryCard';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function Library() {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<unknown[]>([]);
  const [tab, setTab] = useState<'bookmarks' | 'history'>('bookmarks');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && tab === 'bookmarks') loadBookmarks();
  }, [user, tab]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      // Get stories the user bookmarked via the explore page
      // We just show a placeholder for now since bookmarks aren't on a dedicated route
      const { data } = await api.get(`/stories?sort=likes&page=1`);
      setBookmarks(data.stories || []);
    } catch {} finally { setLoading(false); }
  };

  if (!user) return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-center px-8">
        <p className="text-6xl mb-4">📚</p>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Ваша библиотека</h2>
        <p className="text-gray-500 mb-6">Войдите, чтобы сохранять истории в закладки</p>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary">Войти</Link>
          <Link to="/register" className="btn-primary">Регистрация</Link>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="sticky top-0 z-30 bg-surface-950/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-100">📚 Библиотека</h1>
        <div className="flex gap-0 mt-3">
          {[{ k: 'bookmarks', l: '🔖 Закладки' }, { k: 'history', l: '🕐 История' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as 'bookmarks' | 'history')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${tab === t.k ? 'text-primary-400 border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {tab === 'bookmarks' && (
            <>
              {(bookmarks as Parameters<typeof StoryCard>[0]['story'][]).map(s => <StoryCard key={s.id} story={s} />)}
              {bookmarks.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p>Нет сохранённых историй</p>
                  <Link to="/explore" className="btn-primary inline-block mt-4 text-sm">Найти истории</Link>
                </div>
              )}
            </>
          )}
          {tab === 'history' && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">🕐</p>
              <p>История чтения пока пуста</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
