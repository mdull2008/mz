import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { RATINGS, formatWords, formatNum, timeAgo, getAvatar } from '../lib/utils';
import toast from 'react-hot-toast';

interface Chapter { id: string; title: string; content: string; chapter_number: number; word_count: number; notes: string; created_at: string; }
interface Comment { id: string; user_id: string; username: string; display_name: string; avatar: string; content: string; created_at: string; }
interface Story {
  id: string; title: string; summary: string; username: string; display_name: string; avatar: string;
  fandom_name: string; tags: string[]; rating: string; genre: string[]; warnings: string[]; pairing: string;
  status: string; word_count: number; chapters_count: number; views: number; likes_count: number;
  bookmarks_count: number; cover_image: string; updated_at: string; created_at: string;
  is_liked?: boolean; is_bookmarked?: boolean;
}

export default function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [view, setView] = useState<'info' | 'read'>('info');

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const [s, ch, co] = await Promise.all([
        api.get(`/stories/${id}`),
        api.get(`/stories/${id}/chapters`),
        api.get(`/stories/${id}/comments`)
      ]);
      setStory(s.data);
      setLiked(!!s.data.is_liked);
      setLikes(s.data.likes_count || 0);
      setBookmarked(!!s.data.is_bookmarked);
      setChapters(ch.data);
      setComments(co.data);
      if (ch.data.length > 0) setActiveChapter(ch.data[0]);
    } catch {
      toast.error('Ошибка загрузки');
    }
  };

  const toggleLike = async () => {
    if (!user) { toast.error('Войдите'); return; }
    const prev = liked;
    setLiked(!prev); setLikes(l => l + (prev ? -1 : 1));
    try { await api.post(`/stories/${id}/like`); }
    catch { setLiked(prev); setLikes(l => l + (prev ? 1 : -1)); }
  };

  const toggleBookmark = async () => {
    if (!user) { toast.error('Войдите'); return; }
    const prev = bookmarked;
    setBookmarked(!prev);
    try { await api.post(`/stories/${id}/bookmark`); toast.success(prev ? 'Убрано из закладок' : 'Добавлено в закладки!'); }
    catch { setBookmarked(prev); }
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const { data } = await api.post(`/stories/${id}/comments`, { content: comment });
      setComments(prev => [...prev, data]);
      setComment('');
      toast.success('Комментарий добавлен!');
    } catch { toast.error('Ошибка'); }
  };

  if (!story) return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  const rating = RATINGS[story.rating] || RATINGS['G'];

  return (
    <Layout>
      {/* Story header */}
      <div className="border-b border-white/5">
        {/* Banner gradient */}
        <div className="h-32 bg-gradient-to-br from-primary-900 via-purple-900 to-surface-900 relative overflow-hidden">
          {story.cover_image && <img src={story.cover_image} alt="" className="w-full h-full object-cover opacity-30" />}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 to-transparent" />
        </div>

        <div className="px-6 pb-6">
          <div className="flex gap-5 -mt-8 relative">
            {/* Cover */}
            <div className="w-20 h-28 rounded-xl bg-gradient-to-b from-primary-700 to-primary-950 flex-shrink-0 shadow-xl overflow-hidden border-2 border-surface-950">
              {story.cover_image ? <img src={story.cover_image} alt="" className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex items-center justify-center text-3xl">📖</div>
              )}
            </div>
            <div className="pt-10 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-100">{story.title}</h1>
                  <Link to={`/u/${story.username}`} className="flex items-center gap-2 mt-1 group">
                    <img src={getAvatar({ avatar: story.avatar, display_name: story.display_name, username: story.username })} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-sm text-primary-400 group-hover:underline">{story.display_name}</span>
                  </Link>
                </div>
                <span className={`rating-badge border ${rating.bg} ${rating.color} text-sm px-2.5 py-1`}>{rating.label}</span>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-2">
            {story.fandom_name && <span className="tag-chip">{story.fandom_name}</span>}
            {story.genre.map(g => <span key={g} className="tag-chip opacity-75">{g}</span>)}
            {story.tags.map(t => <span key={t} className="tag-chip opacity-60">#{t}</span>)}
            {story.status === 'complete' && <span className="tag-chip bg-green-900/30 text-green-400 border-green-700/30">✓ Завершено</span>}
          </div>

          {story.pairing && (
            <p className="mt-2 text-sm text-gray-400">❤️ Пейринг: <span className="text-gray-300">{story.pairing}</span></p>
          )}

          {/* Stats */}
          <div className="mt-3 flex items-center gap-5 text-sm text-gray-500">
            <span>{formatWords(story.word_count)}</span>
            <span>·</span>
            <span>{story.chapters_count} глав</span>
            <span>·</span>
            <span>👁 {formatNum(story.views)}</span>
            <span>·</span>
            <span>💬 {formatNum(comments.length)}</span>
          </div>

          {/* Summary */}
          {story.summary && (
            <p className="mt-3 text-gray-400 leading-relaxed text-sm">{story.summary}</p>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            {chapters.length > 0 && (
              <button onClick={() => { setView('read'); setActiveChapter(chapters[0]); }}
                className="btn-primary flex items-center gap-2 text-sm">
                📖 Читать
              </button>
            )}
            <button onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm ${liked ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}>
              {liked ? '❤️' : '🤍'} {formatNum(likes)}
            </button>
            <button onClick={toggleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm ${bookmarked ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}>
              {bookmarked ? '🔖' : '📄'} {bookmarked ? 'В закладках' : 'Закладка'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/5">
          {['info', 'read'].map(v => (
            <button key={v} onClick={() => setView(v as 'info' | 'read')}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${view === v ? 'text-primary-400 border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
              {v === 'info' ? '📋 Обзор' : '📖 Главы'}
            </button>
          ))}
        </div>
      </div>

      {view === 'info' ? (
        <div className="p-6 space-y-6">
          {/* Chapters list */}
          {chapters.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-100 mb-3">Оглавление</h3>
              <div className="space-y-2">
                {chapters.map(ch => (
                  <button key={ch.id} onClick={() => { setActiveChapter(ch); setView('read'); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-left group">
                    <span className="text-xs text-gray-600 w-6 text-center">{ch.chapter_number}</span>
                    <span className="flex-1 text-sm text-gray-200 group-hover:text-primary-300 transition-colors">{ch.title}</span>
                    <span className="text-xs text-gray-500">{ch.word_count} сл.</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="font-bold text-gray-100 mb-3">Комментарии ({comments.length})</h3>
            {user && (
              <form onSubmit={postComment} className="mb-4">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Напишите комментарий..."
                  className="input-field resize-none h-20 mb-2 text-sm"
                />
                <button type="submit" className="btn-primary text-sm">Отправить</button>
              </form>
            )}
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <img src={getAvatar({ avatar: c.avatar, display_name: c.display_name, username: c.username })} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/u/${c.username}`} className="text-sm font-medium text-gray-200 hover:text-primary-300">{c.display_name}</Link>
                      <span className="text-xs text-gray-500">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-gray-500 text-sm">Пока нет комментариев. Будьте первым!</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-200px)]">
          {/* Chapter nav */}
          <div className="w-52 border-r border-white/5 overflow-y-auto flex-shrink-0">
            <div className="p-3 space-y-1">
              {chapters.map(ch => (
                <button key={ch.id} onClick={() => setActiveChapter(ch)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${activeChapter?.id === ch.id ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                  <span className="font-medium">{ch.chapter_number}.</span> {ch.title}
                </button>
              ))}
            </div>
          </div>

          {/* Reader */}
          <div className="flex-1 overflow-y-auto">
            {activeChapter ? (
              <div className="max-w-2xl mx-auto p-8">
                <h2 className="text-2xl font-bold text-gray-100 mb-1">{activeChapter.title}</h2>
                <p className="text-sm text-gray-500 mb-6">{activeChapter.word_count} слов · {timeAgo(activeChapter.created_at)}</p>
                {activeChapter.notes && (
                  <div className="mb-6 p-4 rounded-xl bg-primary-900/20 border border-primary-500/20 text-sm text-gray-300">
                    📝 <span className="font-medium">Заметка автора:</span> {activeChapter.notes}
                  </div>
                )}
                <div className="story-content">
                  {activeChapter.content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Next/Prev chapter */}
                <div className="flex gap-3 mt-8 pt-8 border-t border-white/5">
                  {chapters.find(c => c.chapter_number === activeChapter.chapter_number - 1) && (
                    <button onClick={() => setActiveChapter(chapters.find(c => c.chapter_number === activeChapter.chapter_number - 1)!)}
                      className="btn-secondary text-sm flex-1">← Предыдущая глава</button>
                  )}
                  {chapters.find(c => c.chapter_number === activeChapter.chapter_number + 1) && (
                    <button onClick={() => setActiveChapter(chapters.find(c => c.chapter_number === activeChapter.chapter_number + 1)!)}
                      className="btn-primary text-sm flex-1">Следующая глава →</button>
                  )}
                </div>
              </div>
            ) : <div className="p-8 text-gray-500">Выберите главу</div>}
          </div>
        </div>
      )}
    </Layout>
  );
}
