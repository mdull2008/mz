import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function timeAgo(date: string) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
  } catch {
    return date;
  }
}

export function formatDate(date: string) {
  try {
    return format(new Date(date), 'd MMMM yyyy', { locale: ru });
  } catch {
    return date;
  }
}

export function formatWords(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}М слов`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}К слов`;
  return `${n} слов`;
}

export function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}М`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}К`;
  return `${n}`;
}

export const RATINGS: Record<string, { label: string; color: string; bg: string }> = {
  'G': { label: 'G', color: 'text-green-400', bg: 'bg-green-900/50 border-green-700/30' },
  'PG': { label: 'PG', color: 'text-blue-400', bg: 'bg-blue-900/50 border-blue-700/30' },
  'PG-13': { label: 'PG-13', color: 'text-yellow-400', bg: 'bg-yellow-900/50 border-yellow-700/30' },
  'R': { label: 'R', color: 'text-orange-400', bg: 'bg-orange-900/50 border-orange-700/30' },
  'NC-17': { label: 'NC-17', color: 'text-red-400', bg: 'bg-red-900/50 border-red-700/30' },
};

export const GENRES = ['Романтика', 'Драма', 'Приключения', 'Фэнтези', 'Фантастика', 'Экшн', 'Хоррор', 'Юмор', 'Ангст', 'Слайс-оф-лайф', 'Детектив', 'Мистика'];
export const WARNINGS_LIST = ['Насилие', 'Смерть персонажей', 'Тёмные темы', 'Нецензурная лексика', 'Альтернативная вселенная'];

export function getAvatar(user: { avatar?: string; display_name?: string; username?: string }) {
  if (user.avatar && user.avatar.startsWith('http')) return user.avatar;
  const name = user.display_name || user.username || '?';
  const initials = name.replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6d2df2&color=fff&size=80&bold=true`;
}
