import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { formatWords, formatNum, timeAgo, getAvatar, RATINGS } from '../../lib/utils';
import toast from 'react-hot-toast';

interface Story {
  id: string;
  title: string;
  summary: string;
  author_id: string;
  username: string;
  display_name: string;
  avatar: string;
  fandom_name: string;
  tags: string[];
  rating: string;
  genre: string[];
  warnings: string[];
  pairing: string;
  status: string;
  word_count: number;
  chapters_count: number;
  views: number;
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  cover_image: string;
  updated_at: string;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

interface Props {
  story: Story;
  compact?: boolean;
}

export default function StoryCard({ story, compact }: Props) {
  const { user } = useAuthStore();
  const [liked, setLiked] = useState(!!story.is_liked);
  const [likes, setLikes] = useState(story.likes_count || 0);
  const [bookmarked, setBookmarked] = useState(!!story.is_bookmarked);

  const ratingInfo = RATINGS[story.rating] || RATINGS['G'];

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Войдите'); return; }
    const prev = liked;
    setLiked(!prev); setLikes(l => l + (prev ? -1 : 1));
    try { await api.post(`/stories/${story.id}/like`); }
    catch { setLiked(prev); setLikes(l => l + (prev ? 1 : -1)); }
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Войдите'); return; }
    const prev = bookmarked;
    setBookmarked(!prev);
    try { await api.post(`/stories/${story.id}/bookmark`); toast.success(prev ? 'Убрано из закладок' : 'Добавлено в закладки'); }
    catch { setBookmarked(prev); }
  };

  if (compact) {
    return (
      <Link to={`/story/${story.id}`} className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
        <div className="w-10 h-14 rounded-md bg-gradient-to-b from-primary-800 to-primary-950 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {story.cover_image ? (
            <img src={story.cover_image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">📖</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-100 group-hover:text-primary-300 transition-colors truncate">{story.title}</p>
          <p className="text-xs text-gray-500">{story.display_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`rating-badge border text-[10px] ${ratingInfo.bg} ${ratingInfo.color}`}>{ratingInfo.label}</span>
            <span className="text-xs text-gray-600">{formatWords(story.word_count)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="card-hover p-5 animate-fade-in">
      <Link to={`/story/${story.id}`} className="block">
        <div className="flex gap-4">
          {/* Cover */}
          <div className="w-16 h-24 rounded-lg bg-gradient-to-b from-primary-700 to-primary-950 flex-shrink-0 overflow-hidden shadow-lg">
            {story.cover_image ? (
              <img src={story.cover_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-100 text-base leading-tight group-hover:text-primary-300 line-clamp-2">
                {story.title}
              </h3>
              <span className={`rating-badge border flex-shrink-0 ${ratingInfo.bg} ${ratingInfo.color}`}>
                {ratingInfo.label}
              </span>
            </div>

            {/* Author */}
            <Link
              to={`/u/${story.username}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 mb-2 group/author"
            >
              <img src={getAvatar({ avatar: story.avatar, display_name: story.display_name, username: story.username })} alt="" className="w-4 h-4 rounded-full" />
              <span className="text-xs text-primary-400 group-hover/author:underline">{story.display_name}</span>
            </Link>

            {/* Fandom + Genre */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {story.fandom_name && (
                <Link to={`/explore?fandom=${encodeURIComponent(story.fandom_name)}`} onClick={e => e.stopPropagation()} className="tag-chip hover:bg-primary-800/50">
                  {story.fandom_name}
                </Link>
              )}
              {story.genre.slice(0, 2).map(g => (
                <span key={g} className="tag-chip opacity-75">{g}</span>
              ))}
              {story.status === 'complete' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/30">
                  ✓ Завершено
                </span>
              )}
            </div>

            {/* Summary */}
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">{story.summary}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span title="Слов">{formatWords(story.word_count)}</span>
              <span>·</span>
              <span>{story.chapters_count} гл.</span>
              <span>·</span>
              <span>👁 {formatNum(story.views)}</span>
              <span className="ml-auto text-gray-600">{timeAgo(story.updated_at)}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}>
          {liked ? '❤️' : '🤍'} {formatNum(likes)}
        </button>
        <span className="text-gray-600 text-xs flex items-center gap-1">
          💬 {formatNum(story.comments_count)}
        </span>
        <button onClick={toggleBookmark} className={`flex items-center gap-1.5 text-xs transition-colors ml-auto ${bookmarked ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}>
          {bookmarked ? '🔖' : '📄'} {bookmarked ? 'В закладках' : 'Закладка'}
        </button>
      </div>
    </article>
  );
}
