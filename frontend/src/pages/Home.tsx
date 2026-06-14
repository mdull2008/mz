import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ComposePost from '../components/post/ComposePost';
import PostCard from '../components/post/PostCard';
import StoryCard from '../components/story/StoryCard';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'feed' | 'global' | 'stories'>('feed');
  const [posts, setPosts] = useState<unknown[]>([]);
  const [stories, setStories] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingFandoms, setTrendingFandoms] = useState<unknown[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<unknown[]>([]);

  useEffect(() => {
    loadContent();
    loadSidebar();
  }, [tab, user]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (tab === 'feed' && user) {
        const { data } = await api.get('/posts/feed');
        setPosts(data);
      } else if (tab === 'global') {
        const { data } = await api.get('/posts');
        setPosts(data);
      } else {
        const { data } = await api.get('/stories?sort=updated');
        setStories(data.stories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadSidebar = async () => {
    try {
      const [f, u] = await Promise.all([
        api.get('/fandoms'),
        api.get('/users?q=')
      ]);
      setTrendingFandoms(f.data.slice(0, 6));
      setSuggestedUsers((u.data || []).slice(0, 4));
    } catch {}
  };

  const handlePost = (post: unknown) => {
    setPosts(prev => [post, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => (prev as { id: string }[]).filter(p => p.id !== id));
  };

  const rightPanel = (
    <>
      {/* Search */}
      <Link to="/explore" className="flex items-center gap-3 bg-surface-900 border border-white/10 rounded-full px-4 py-2.5 text-gray-500 hover:border-primary-500/50 transition-colors">
        <span>🔍</span>
        <span className="text-sm">Поиск историй и авторов...</span>
      </Link>

      {/* Fandoms */}
      {trendingFandoms.length > 0 && (
        <div className="card p-4">
          <h3 className="font-bold text-gray-100 mb-3 text-sm">🔥 Популярные фэндомы</h3>
          <div className="space-y-1">
            {(trendingFandoms as { id: string; name: string; category: string; stories_count: number }[]).map(f => (
              <Link key={f.id} to={`/explore?fandom=${encodeURIComponent(f.name)}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                <div>
                  <p className="text-sm text-gray-200 group-hover:text-primary-300 transition-colors">{f.name}</p>
                  <p className="text-xs text-gray-500">{f.category}</p>
                </div>
                <span className="text-xs text-gray-600">{f.stories_count} фиков</span>
              </Link>
            ))}
          </div>
          <Link to="/explore" className="block mt-2 text-xs text-primary-400 hover:underline">Все фэндомы →</Link>
        </div>
      )}

      {/* Suggested users */}
      {suggestedUsers.length > 0 && (
        <div className="card p-4">
          <h3 className="font-bold text-gray-100 mb-3 text-sm">👥 Авторы</h3>
          <div className="space-y-3">
            {(suggestedUsers as { id: string; username: string; display_name: string; bio: string; avatar: string; is_writer: number }[]).map(u => (
              <Link key={u.id} to={`/u/${u.username}`} className="flex items-center gap-3 group">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.display_name)}&background=6d2df2&color=fff&size=40`} alt="" className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 group-hover:text-primary-300 transition-colors truncate">{u.display_name}</p>
                  <p className="text-xs text-gray-500 truncate">@{u.username} {u.is_writer ? '✍️' : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Layout rightPanel={rightPanel}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface-950/80 backdrop-blur-md border-b border-white/5">
        <div className="p-4 pb-0">
          <h1 className="text-xl font-bold text-gray-100 mb-3">Главная</h1>
          <div className="flex gap-0">
            {[
              { key: 'feed', label: user ? 'Лента' : 'Глобальная', show: true },
              { key: 'global', label: 'Посты', show: !!user },
              { key: 'stories', label: '📚 Истории', show: true },
            ].filter(t => t.show).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as 'feed' | 'global' | 'stories')}
                className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                  tab === t.key ? 'text-primary-400 border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compose */}
      {user && (tab === 'feed' || tab === 'global') && (
        <ComposePost onPost={handlePost} />
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'stories' ? (
        <div className="p-4 space-y-4">
          {(stories as Parameters<typeof StoryCard>[0]['story'][]).map(s => (
            <StoryCard key={s.id} story={s} />
          ))}
          {stories.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p>Пока нет историй</p>
              {user && <Link to="/write" className="btn-primary inline-block mt-4 text-sm">Написать первую</Link>}
            </div>
          )}
        </div>
      ) : (
        <div>
          {(posts as Parameters<typeof PostCard>[0]['post'][]).map(p => (
            <PostCard key={p.id} post={p} onDelete={handleDeletePost} />
          ))}
          {posts.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">🌙</p>
              <p className="mb-2">
                {tab === 'feed' && user ? 'В вашей ленте пока пусто' : 'Постов пока нет'}
              </p>
              {tab === 'feed' && (
                <p className="text-sm">Подпишитесь на авторов, чтобы видеть их посты</p>
              )}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
