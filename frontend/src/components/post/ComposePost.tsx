import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { getAvatar } from '../../lib/utils';
import toast from 'react-hot-toast';

interface Props {
  onPost?: (post: unknown) => void;
  placeholder?: string;
  replyTo?: string;
}

export default function ComposePost({ onPost, placeholder, replyTo }: Props) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const MAX = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const { data } = await api.post('/posts', { content: content.trim(), reply_to: replyTo });
      setContent('');
      onPost?.(data);
      toast.success('Опубликовано!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Ошибка';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const remaining = MAX - content.length;
  const over = remaining < 0;

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-white/5">
      <div className="flex gap-3">
        <img src={getAvatar(user)} alt="" className="w-10 h-10 rounded-full flex-shrink-0 ring-1 ring-white/10" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={placeholder || 'Что у вас нового?'}
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-base resize-none focus:outline-none min-h-[80px] leading-relaxed"
            maxLength={600}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <div className={`text-xs ${over ? 'text-red-400' : remaining < 50 ? 'text-yellow-400' : 'text-gray-500'}`}>
              {remaining < 100 && `${remaining} символов`}
            </div>
            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${over ? 'border-red-400' : 'border-primary-500'}`}>
                  <svg viewBox="0 0 36 36" className="w-4 h-4 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={over ? '#f87171' : '#7c4dff'}
                      strokeWidth="3"
                      strokeDasharray={`${Math.min(content.length / MAX, 1) * 94.2} 94.2`}
                    />
                  </svg>
                </div>
              )}
              <button
                type="submit"
                disabled={!content.trim() || over || loading}
                className="btn-primary text-sm px-5 py-2"
              >
                {loading ? '...' : 'Опубликовать'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
