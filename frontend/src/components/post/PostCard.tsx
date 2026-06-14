import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { timeAgo, getAvatar, formatNum } from '../../lib/utils';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  content: string;
  images: string[];
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
  likes_count: number;
  reposts_count: number;
  replies_count: number;
  views: number;
  is_liked?: boolean;
  created_at: string;
  reply_to?: string;
  repost?: {
    id: string;
    content: string;
    username: string;
    display_name: string;
    avatar: string;
    created_at: string;
  };
}

interface Props {
  post: Post;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function PostCard({ post, onDelete, compact }: Props) {
  const { user } = useAuthStore();
  const [liked, setLiked] = useState(!!post.is_liked);
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [reposts, setReposts] = useState(post.reposts_count || 0);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Войдите, чтобы поставить лайк'); return; }
    const prev = liked;
    setLiked(!prev);
    setLikes(l => l + (prev ? -1 : 1));
    try {
      await api.post(`/posts/${post.id}/like`);
    } catch {
      setLiked(prev);
      setLikes(l => l + (prev ? 1 : -1));
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Войдите, чтобы репостнуть'); return; }
    try {
      await api.post('/posts', { content: '', repost_of: post.id });
      setReposts(r => r + 1);
      toast.success('Репост добавлен!');
    } catch {
      toast.error('Ошибка');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Удалить пост?')) return;
    try {
      await api.delete(`/posts/${post.id}`);
      onDelete?.(post.id);
      toast.success('Удалено');
    } catch {
      toast.error('Ошибка');
    }
  };

  return (
    <article className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      <Link to={`/post/${post.id}`} className="block p-4">
        <div className="flex gap-3">
          <Link to={`/u/${post.username}`} onClick={e => e.stopPropagation()}>
            <img
              src={getAvatar({ avatar: post.avatar, display_name: post.display_name, username: post.username })}
              alt={post.display_name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/u/${post.username}`} onClick={e => e.stopPropagation()} className="font-semibold text-gray-100 hover:underline text-sm">
                {post.display_name}
              </Link>
              <span className="text-gray-500 text-sm">@{post.username}</span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-500 text-xs">{timeAgo(post.created_at)}</span>
              {user?.id === post.user_id && (
                <button onClick={handleDelete} className="ml-auto text-gray-600 hover:text-red-400 text-xs transition-colors">✕</button>
              )}
            </div>

            {post.content && (
              <p className="text-gray-200 text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                {post.content}
              </p>
            )}

            {post.repost && (
              <div className="mt-2 p-3 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <img src={getAvatar({ display_name: post.repost.display_name, username: post.repost.username })} alt="" className="w-5 h-5 rounded-full" />
                  <span className="text-xs font-semibold text-gray-300">{post.repost.display_name}</span>
                  <span className="text-xs text-gray-500">@{post.repost.username}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{post.repost.content}</p>
              </div>
            )}

            {!compact && (
              <div className="flex items-center gap-5 mt-3">
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-primary-400 transition-colors text-xs group"
                >
                  <span className="group-hover:scale-110 transition-transform">💬</span>
                  <span>{formatNum(post.replies_count || 0)}</span>
                </button>
                <button
                  onClick={handleRepost}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-green-400 transition-colors text-xs group"
                >
                  <span className="group-hover:scale-110 transition-transform">🔁</span>
                  <span>{formatNum(reposts)}</span>
                </button>
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-1.5 transition-colors text-xs group ${liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                >
                  <span className={`group-hover:scale-110 transition-transform ${liked ? 'scale-110' : ''}`}>
                    {liked ? '❤️' : '🤍'}
                  </span>
                  <span>{formatNum(likes)}</span>
                </button>
                <span className="ml-auto flex items-center gap-1 text-gray-600 text-xs">
                  <span>👁</span>
                  <span>{formatNum(post.views || 0)}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
