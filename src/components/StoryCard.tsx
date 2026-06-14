import Link from "next/link";
import { formatRelative, parseTags } from "@/lib/utils";

type StoryCardProps = {
  story: {
    id: string;
    title: string;
    summary: string;
    cover: string;
    fandom: string;
    rating: string;
    status: string;
    tags: string;
    updatedAt: Date;
    user: { username: string; displayName: string };
    chapters: { id: string }[];
    likes: { id: string }[];
  };
};

export default function StoryCard({ story }: StoryCardProps) {
  const tags = parseTags(story.tags);

  return (
    <article className="card hover:bg-card-hover transition-colors">
      <div className="flex items-start gap-4">
        <Link href={`/stories/${story.id}`} className="shrink-0">
          {story.cover ? (
            <img
              src={story.cover}
              alt={story.title}
              className="w-20 h-28 object-cover rounded-xl border border-border"
            />
          ) : (
            <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 border border-border flex items-center justify-center text-2xl">
              📖
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/stories/${story.id}`} className="group">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {story.title}
            </h3>
          </Link>
          <p className="text-sm text-muted mt-1">
            <Link href={`/profile/${story.user.username}`} className="hover:text-foreground">
              {story.user.displayName}
            </Link>
            {" · "}
            {formatRelative(story.updatedAt)}
          </p>
          <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{story.summary}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="tag">{story.fandom}</span>
            <span className="tag">{story.rating}</span>
            <span className="tag">
              {story.status === "complete" ? "Завершён" : "В процессе"}
            </span>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right text-sm text-muted shrink-0">
          <div>{story.chapters.length} гл.</div>
          <div>♥ {story.likes.length}</div>
        </div>
      </div>
    </article>
  );
}
