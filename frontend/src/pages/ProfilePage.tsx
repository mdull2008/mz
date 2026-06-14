import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PostCard from '../components/post/PostCard';
import StoryCard from '../components/story/StoryCard';
import ComposePost from '../components/post/ComposePost';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { formatDate, getAvatar, formatNum } from '../lib/utils';
import toast from 'react-hot-toast';

interface Profile {
  id: string; username: string; display_name: string; bio: string;
  avatar: string; banner: string; location: string; website: string;
  is_writer: number; followers_count: number; following_count: number;
  stories_count: number; posts_count: number; created_at: string; is_following?: boolean;
}

type Tab = 'posts' | 'stories' | 'bookmarks';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: me, fetchMe } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<unknown[]>([]);
  const [stories, setStories] = useState<unknown[]>([]);
  const [bookmarks, setBookmarks] = useState<unknown[]>([]);
  const [following, setFollowing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ display_name: '', bio: '', avatar: '', location: '', website: '' });
  const [loading, setLoading] = useState(true);

  const isMe = me?.username === username;

  useEffect(() => {
    loadProfile();
  }, [username]);

  useEffect(() => {
    if (profile) loadTab();
  }, [tab, profile]);

  const loadProfile = async () => {
    try {
      const { data } = await api.get(`/users/${username}`);
      setProfile(data);
      setFollowing(!!data.is_following);
      setEditData({ display_name: data.display_name, bio: data.bio, avatar: data.avatar, location: data.location, website: data.website });
    } catch { toast.error('Профиль не найден'); }
    finally { setLoading(false); }
  };

  const loadTab = async () => {
    if (!profile) return;
    try {
      if (tab === 'posts') {
        const { data } = await api.get(`/posts?user_id=${profile.id}`);
        setPosts(data);
      } else if (tab === 'stories') {
        const { data } = await api.get(`/stories?author=${profile.username}`);
        setStories(data.stories || []);
      }
    } catch {}
  };

  const toggleFollow = async () => {
    if (!me) { toast.error('Войдите'); return; }
    const prev = following;
    setFollowing(!prev);
    setProfile(p => p ? { ...p, followers_count: p.followers_count + (prev ? -1 : 1) } : p);
    try { await api.post(`/users/${profile!.id}/follow`); }
    catch { setFollowing(prev); }
  };

  const saveEdit = async () => {
    try {
      await api.put('/auth/me', editData);
      await fetchMe();
      setEditing(false);
      toast.success('Профиль обновлён!');
      loadProfile();
    } catch { toast.error('Ошибка'); }
  };

  const handleDeletePost = (id: string) => setPosts(prev => (prev as { id: string }[]).filter(p => p.id !== id));
  const handleNewPost = (post: unknown) => setPosts(prev => [post, ...prev]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  if (!profile) return (
    <Layout><div className="p-8 text-center text-gray-500">Пользователь не найден</div></Layout>
  );

  return (
    <Layout>
      {/* Banner */}
      <div className="h-36 bg-gradient-to-br from-primary-900 via-purple-900 to-surface-900 relative overflow-hidden">
        {profile.banner && <img src={profile.banner} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/60 to-transparent" />
      </div>

      {/* Profile info */}
      <div className="px-6 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-4 relative">
          <img
            src={getAvatar(profile)}
            alt={profile.display_name}
            className="w-20 h-20 rounded-full border-4 border-surface-950 object-cover shadow-xl"
          />
          <div className="flex gap-2">
            {isMe ? (
              <button onClick={() => setEditing(!editing)} className="btn-secondary text-sm">
                ✏️ Редактировать
              </button>
            ) : (
              me && (
                <button onClick={toggleFollow}
                  className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all ${following ? 'border-white/20 text-gray-300 hover:border-red-500/50 hover:text-red-400' : 'btn-primary'}`}>
                  {following ? 'Отписаться' : '+ Подписаться'}
                </button>
              )
            )}
            {isMe && profile.is_writer === 1 && (
              <Link to="/write" className="btn-primary text-sm">✍️ Написать</Link>
            )}
          </div>
        </div>

        {editing ? (
          <div className="space-y-3 mb-4 p-4 rounded-xl bg-surface-900 border border-white/5">
            <input value={editData.display_name} onChange={e => setEditData(d => ({ ...d, display_name: e.target.value }))} placeholder="Имя" className="input-field text-sm" />
            <textarea value={editData.bio} onChange={e => setEditData(d => ({ ...d, bio: e.target.value }))} placeholder="О себе..." className="input-field resize-none h-20 text-sm" />
            <input value={editData.avatar} onChange={e => setEditData(d => ({ ...d, avatar: e.target.value }))} placeholder="Ссылка на аватар" className="input-field text-sm" />
            <input value={editData.location} onChange={e => setEditData(d => ({ ...d, location: e.target.value }))} placeholder="Местоположение" className="input-field text-sm" />
            <input value={editData.website} onChange={e => setEditData(d => ({ ...d, website: e.target.value }))} placeholder="Сайт" className="input-field text-sm" />
            <div className="flex gap-2">
              <button onClick={saveEdit} className="btn-primary text-sm">Сохранить</button>
              <button onClick={() => setEditing(false)} className="btn-ghost text-sm">Отмена</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-100">{profile.display_name}</h1>
            <p className="text-sm text-gray-500">@{profile.username} {profile.is_writer ? '✍️' : '📚'}</p>
            {profile.bio && <p className="mt-2 text-sm text-gray-300 leading-relaxed">{profile.bio}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
              {profile.location && <span>📍 {profile.location}</span>}
              {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline">🔗 {profile.website}</a>}
              <span>📅 с {formatDate(profile.created_at)}</span>
            </div>
            <div className="flex gap-5 mt-3 text-sm">
              <Link to={`/u/${profile.username}/following`} className="hover:underline">
                <span className="font-bold text-gray-100">{formatNum(profile.following_count)}</span>
                <span className="text-gray-500 ml-1">подписки</span>
              </Link>
              <Link to={`/u/${profile.username}/followers`} className="hover:underline">
                <span className="font-bold text-gray-100">{formatNum(profile.followers_count)}</span>
                <span className="text-gray-500 ml-1">подписчиков</span>
              </Link>
              {profile.is_writer === 1 && (
                <span>
                  <span className="font-bold text-gray-100">{formatNum(profile.stories_count)}</span>
                  <span className="text-gray-500 ml-1">историй</span>
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 border-t border-t-white/5">
        <div className="flex">
          {([
            { key: 'posts', label: '💬 Посты' },
            { key: 'stories', label: '📖 Истории', show: profile.is_writer === 1 },
          ] as { key: Tab; label: string; show?: boolean }[]).filter(t => t.show !== false).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${tab === t.key ? 'text-primary-400 border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'posts' && (
        <>
          {isMe && <ComposePost onPost={handleNewPost} />}
          {(posts as Parameters<typeof PostCard>[0]['post'][]).map(p => (
            <PostCard key={p.id} post={p} onDelete={handleDeletePost} />
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p>Постов пока нет</p>
            </div>
          )}
        </>
      )}

      {tab === 'stories' && (
        <div className="p-4 space-y-4">
          {(stories as Parameters<typeof StoryCard>[0]['story'][]).map(s => (
            <StoryCard key={s.id} story={s} />
          ))}
          {stories.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p>Историй пока нет</p>
              {isMe && <Link to="/write" className="btn-primary inline-block mt-4 text-sm">Написать первую</Link>}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
