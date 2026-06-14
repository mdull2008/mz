import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StoryCard from '../components/story/StoryCard';
import api from '../lib/api';

const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
const SORTS = [
  { value: 'updated', label: 'Обновлено' },
  { value: 'newest', label: 'Новые' },
  { value: 'views', label: 'Просмотры' },
  { value: 'likes', label: 'Лайки' },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [stories, setStories] = useState<unknown[]>([]);
  const [fandoms, setFandoms] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const q = params.get('q') || '';
  const fandom = params.get('fandom') || '';
  const rating = params.get('rating') || '';
  const sort = params.get('sort') || 'updated';
  const status = params.get('status') || '';

  useEffect(() => {
    loadFandoms();
  }, []);

  useEffect(() => {
    loadStories(1);
    setPage(1);
  }, [q, fandom, rating, sort, status]);

  const loadFandoms = async () => {
    const { data } = await api.get('/fandoms');
    setFandoms(data);
  };

  const loadStories = async (p = page) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ sort, page: String(p) });
      if (q) queryParams.set('q', q);
      if (fandom) queryParams.set('fandom', fandom);
      if (rating) queryParams.set('rating', rating);
      if (status) queryParams.set('status', status);
      const { data } = await api.get(`/stories?${queryParams}`);
      if (p === 1) setStories(data.stories || []);
      else setStories(prev => [...prev, ...(data.stories || [])]);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: string) => {
    const p = new URLSearchParams(params);
    if (val) p.set(key, val); else p.delete(key);
    setParams(p);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadStories(next);
  };

  return (
    <Layout>
      <div className="sticky top-0 z-30 bg-surface-950/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="flex items-center gap-3 bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-primary-500/50 transition-colors">
          <span className="text-gray-500">🔍</span>
          <input
            value={q}
            onChange={e => set('q', e.target.value)}
            placeholder="Поиск историй, авторов, тегов..."
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
          />
          {q && <button onClick={() => set('q', '')} className="text-gray-500 hover:text-gray-300">✕</button>}
        </div>
      </div>

      <div className="flex gap-0">
        {/* Filters sidebar */}
        <div className="w-48 flex-shrink-0 p-4 border-r border-white/5 space-y-5">
          {/* Sort */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Сортировка</h4>
            <div className="space-y-1">
              {SORTS.map(s => (
                <button key={s.value} onClick={() => set('sort', s.value)}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${sort === s.value ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Рейтинг</h4>
            <div className="space-y-1">
              <button onClick={() => set('rating', '')}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!rating ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                Все
              </button>
              {RATINGS.map(r => (
                <button key={r} onClick={() => set('rating', r)}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${rating === r ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Статус</h4>
            <div className="space-y-1">
              {[{ v: '', l: 'Все' }, { v: 'ongoing', l: '⏳ Продолжается' }, { v: 'complete', l: '✅ Завершено' }].map(s => (
                <button key={s.v} onClick={() => set('status', s.v)}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${status === s.v ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                  {s.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Fandom pills */}
          {(fandoms as { id: string; name: string }[]).length > 0 && (
            <div className="p-4 border-b border-white/5">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => set('fandom', '')}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!fandom ? 'bg-primary-600 text-white border-primary-500' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}>
                  Все
                </button>
                {(fandoms as { id: string; name: string }[]).map(f => (
                  <button key={f.id} onClick={() => set('fandom', fandom === f.name ? '' : f.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${fandom === f.name ? 'bg-primary-600 text-white border-primary-500' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'}`}>
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {loading ? 'Загрузка...' : `${total} ${total === 1 ? 'история' : total < 5 ? 'истории' : 'историй'}`}
              </p>
              {fandom && (
                <span className="tag-chip">
                  {fandom} <button onClick={() => set('fandom', '')} className="ml-1 hover:text-red-400">✕</button>
                </span>
              )}
            </div>

            {loading && stories.length === 0 ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {(stories as Parameters<typeof StoryCard>[0]['story'][]).map(s => (
                  <StoryCard key={s.id} story={s} />
                ))}
                {stories.length === 0 && !loading && (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-5xl mb-4">📭</p>
                    <p className="text-lg">Ничего не найдено</p>
                    <p className="text-sm mt-1">Попробуйте изменить фильтры</p>
                  </div>
                )}
                {stories.length > 0 && stories.length < total && (
                  <button onClick={loadMore} disabled={loading}
                    className="w-full py-3 text-sm text-primary-400 hover:text-primary-300 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    {loading ? 'Загрузка...' : 'Загрузить ещё'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
