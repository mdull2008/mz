import Link from "next/link";
import { getInitials, formatRelative } from "@/lib/utils";
import { togglePostLikeAction } from "@/lib/actions";

type PostCardProps = {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    user: { username: string; displayName: string };
    likes: { userId: string }[];
    comments: { id: string }[];
  };
  currentUserId?: string;
};

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const isLiked = currentUserId
    ? post.likes.some((l) => l.userId === currentUserId)
    : false;

  return (
    <article className="card hover:bg-card-hover transition-colors">
      <div className="flex gap-3">
        <Link href={`/profile/${post.user.username}`}>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold shrink-0">
            {getInitials(post.user.displayName)}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profile/${post.user.username}`}
              className="font-semibold hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={`/profile/${post.user.username}`}
              className="text-muted text-sm"
            >
              @{post.user.username}
            </Link>
            <span className="text-muted text-sm">· {formatRelative(post.createdAt)}</span>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>
          <div className="flex items-center gap-6 mt-3 text-sm text-muted">
            {currentUserId ? (
              <form action={togglePostLikeAction.bind(null, post.id)}>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 hover:text-accent transition-colors ${isLiked ? "text-accent" : ""}`}
                >
                  ♥ {post.likes.length}
                </button>
              </form>
            ) : (
              <span className="flex items-center gap-1.5">♥ {post.likes.length}</span>
            )}
            <span>💬 {post.comments.length}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
