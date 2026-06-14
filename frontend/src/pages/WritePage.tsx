import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { RATINGS as RATING_MAP, GENRES, WARNINGS_LIST } from '../lib/utils';
import toast from 'react-hot-toast';

interface Chapter { id: string; title: string; content: string; chapter_number: number; notes: string; }

export default function WritePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [step, setStep] = useState<'meta' | 'write'>(isEdit ? 'write' : 'meta');
  const [storyId, setStoryId] = useState(id || '');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [saving, setSaving] = useState(false);

  const [meta, setMeta] = useState({
    title: '', summary: '', fandom_name: '', rating: 'G', genre: [] as string[],
    warnings: [] as string[], tags: '' , pairing: '', language: 'Русский', status: 'ongoing', cover_image: '',
  });

  const [chapterData, setChapterData] = useState({ title: '', content: '', notes: '' });

  useEffect(() => {
    if (!user) navigate('/login');
    if (isEdit) loadStory();
  }, []);

  const loadStory = async () => {
    try {
      const [s, ch] = await Promise.all([api.get(`/stories/${id}`), api.get(`/stories/${id}/chapters`)]);
      const story = s.data;
      setMeta({
        title: story.title, summary: story.summary, fandom_name: story.fandom_name,
        rating: story.rating, genre: story.genre, warnings: story.warnings,
        tags: story.tags.join(', '), pairing: story.pairing, language: story.language,
        status: story.status, cover_image: story.cover_image,
      });
      setChapters(ch.data);
      if (ch.data.length > 0) {
        setActiveChapter(ch.data[0]);
        setChapterData({ title: ch.data[0].title, content: ch.data[0].content, notes: ch.data[0].notes });
      }
    } catch { toast.error('Ошибка загрузки'); }
  };

  const saveMeta = async () => {
    if (!meta.title.trim()) { toast.error('Введите название'); return; }
    setSaving(true);
    try {
      const payload = { ...meta, tags: meta.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (isEdit || storyId) {
        await api.put(`/stories/${storyId}`, payload);
        toast.success('Сохранено');
      } else {
        const { data } = await api.post('/stories', payload);
        setStoryId(data.id);
      }
      setStep('write');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Ошибка');
    } finally { setSaving(false); }
  };

  const saveChapter = async () => {
    if (!chapterData.content.trim()) { toast.error('Введите текст главы'); return; }
    setSaving(true);
    try {
      if (activeChapter?.id) {
        const { data } = await api.put(`/stories/${storyId}/chapters/${activeChapter.id}`, chapterData);
        setChapters(prev => prev.map(c => c.id === data.id ? data : c));
        setActiveChapter(data);
      } else {
        const { data } = await api.post(`/stories/${storyId}/chapters`, chapterData);
        setChapters(prev => [...prev, data]);
        setActiveChapter(data);
      }
      toast.success('Глава сохранена!');
    } catch { toast.error('Ошибка'); }
    finally { setSaving(false); }
  };

  const addNewChapter = () => {
    setActiveChapter(null);
    setChapterData({ title: '', content: '', notes: '' });
  };

  const selectChapter = (ch: Chapter) => {
    setActiveChapter(ch);
    setChapterData({ title: ch.title, content: ch.content, notes: ch.notes || '' });
  };

  const toggleArray = (arr: string[], val: string, set: (v: string[]) => void) => {
    if (arr.includes(val)) set(arr.filter(i => i !== val));
    else set([...arr, val]);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="sticky top-0 z-30 bg-surface-950/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-300 transition-colors">←</button>
          <h1 className="text-lg font-bold text-gray-100">{isEdit ? 'Редактировать' : 'Новая история'}</h1>
          <div className="flex gap-0 bg-surface-900 rounded-full p-1">
            {(['meta', 'write'] as const).map(s => (
              <button key={s} onClick={() => s === 'write' && !storyId ? null : setStep(s)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${step === s ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                {s === 'meta' ? '📋 О произведении' : '✍️ Главы'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {step === 'meta' ? (
            <button onClick={saveMeta} disabled={saving} className="btn-primary text-sm">
              {saving ? '...' : storyId ? 'Сохранить' : 'Далее →'}
            </button>
          ) : (
            <>
              <button onClick={saveChapter} disabled={saving} className="btn-primary text-sm">
                {saving ? '...' : '💾 Сохранить главу'}
              </button>
              <button onClick={() => navigate(`/story/${storyId}`)} className="btn-secondary text-sm">
                👁 Просмотр
              </button>
            </>
          )}
        </div>
      </div>

      {step === 'meta' ? (
        <div className="max-w-2xl mx-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Название *</label>
            <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))}
              placeholder="Введите название истории"
              className="input-field text-lg font-medium" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Аннотация</label>
            <textarea value={meta.summary} onChange={e => setMeta(m => ({ ...m, summary: e.target.value }))}
              placeholder="Краткое описание истории (без спойлеров)"
              className="input-field resize-none h-28 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Фэндом</label>
              <input value={meta.fandom_name} onChange={e => setMeta(m => ({ ...m, fandom_name: e.target.value }))}
                placeholder="Гарри Поттер, Оригинальное..." className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Пейринг</label>
              <input value={meta.pairing} onChange={e => setMeta(m => ({ ...m, pairing: e.target.value }))}
                placeholder="Персонаж А/Персонаж Б" className="input-field text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Рейтинг</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(RATING_MAP).map(([r, info]) => (
                <button key={r} type="button" onClick={() => setMeta(m => ({ ...m, rating: r }))}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${meta.rating === r ? `${info.bg} ${info.color} border-current` : 'border-white/10 text-gray-500 hover:border-white/20'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Жанры</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button key={g} type="button" onClick={() => toggleArray(meta.genre, g, v => setMeta(m => ({ ...m, genre: v })))}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${meta.genre.includes(g) ? 'bg-primary-600/30 border-primary-500/50 text-primary-300' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Предупреждения</label>
            <div className="flex flex-wrap gap-2">
              {WARNINGS_LIST.map(w => (
                <button key={w} type="button" onClick={() => toggleArray(meta.warnings, w, v => setMeta(m => ({ ...m, warnings: v })))}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${meta.warnings.includes(w) ? 'bg-orange-600/20 border-orange-500/40 text-orange-300' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
                  ⚠️ {w}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Теги (через запятую)</label>
            <input value={meta.tags} onChange={e => setMeta(m => ({ ...m, tags: e.target.value }))}
              placeholder="AU, флафф, хэппи-энд, магия..." className="input-field text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Статус</label>
              <select value={meta.status} onChange={e => setMeta(m => ({ ...m, status: e.target.value }))} className="input-field text-sm">
                <option value="ongoing">⏳ Продолжается</option>
                <option value="complete">✅ Завершено</option>
                <option value="hiatus">⏸ Заморожено</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Язык</label>
              <select value={meta.language} onChange={e => setMeta(m => ({ ...m, language: e.target.value }))} className="input-field text-sm">
                <option>Русский</option>
                <option>English</option>
                <option>Украинский</option>
                <option>Беларуский</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Ссылка на обложку (необязательно)</label>
            <input value={meta.cover_image} onChange={e => setMeta(m => ({ ...m, cover_image: e.target.value }))}
              placeholder="https://..." className="input-field text-sm" />
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-65px)]">
          {/* Chapters sidebar */}
          <div className="w-52 border-r border-white/5 flex flex-col">
            <div className="p-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Главы</span>
              <button onClick={addNewChapter} className="text-primary-400 hover:text-primary-300 text-lg" title="Новая глава">+</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chapters.map(ch => (
                <button key={ch.id} onClick={() => selectChapter(ch)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${activeChapter?.id === ch.id ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                  <span className="font-semibold">{ch.chapter_number}.</span> {ch.title}
                </button>
              ))}
              {chapters.length === 0 && !activeChapter && (
                <p className="text-xs text-gray-600 text-center py-4">Нажмите + чтобы добавить главу</p>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex gap-3">
              <input value={chapterData.title} onChange={e => setChapterData(d => ({ ...d, title: e.target.value }))}
                placeholder={`Название главы ${chapters.length + (activeChapter ? 0 : 1)}...`}
                className="input-field text-sm font-medium flex-1" />
            </div>
            <textarea
              value={chapterData.content}
              onChange={e => setChapterData(d => ({ ...d, content: e.target.value }))}
              placeholder="Начните писать вашу историю...

Используйте пустые строки для разделения абзацев."
              className="flex-1 bg-transparent text-gray-100 p-6 resize-none focus:outline-none story-content leading-relaxed placeholder-gray-600 text-base"
            />
            <div className="p-3 border-t border-white/5 flex items-center gap-4">
              <input value={chapterData.notes} onChange={e => setChapterData(d => ({ ...d, notes: e.target.value }))}
                placeholder="Заметка автора (необязательно)..."
                className="flex-1 bg-transparent text-sm text-gray-500 placeholder-gray-600 focus:outline-none" />
              <span className="text-xs text-gray-600">
                {chapterData.content.trim().split(/\s+/).filter(Boolean).length} слов
              </span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
