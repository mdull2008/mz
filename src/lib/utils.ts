export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} дн. назад`;
  return formatDate(d);
}

export function parseTags(tags: string): string[] {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const RATINGS = [
  { value: "G", label: "G — для всех" },
  { value: "PG", label: "PG — с родителями" },
  { value: "PG-13", label: "PG-13 — 13+" },
  { value: "T", label: "T — подростки" },
  { value: "M", label: "M — взрослые" },
  { value: "NC-17", label: "NC-17 — 18+" },
];

export const FANDOMS = [
  "Harry Potter",
  "Marvel",
  "Аниме",
  "BTS / K-pop",
  "Оригинальные работы",
  "Игры",
  "Дорамы",
  "Книги",
  "Фильмы",
  "Другое",
];
