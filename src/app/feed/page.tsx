import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";

export default async function FeedPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const following = await prisma.follow.findMany({
    where: { followerId: session.id },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { userId: { in: followingIds } },
        { userId: session.id },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { username: true, displayName: true } },
      likes: { select: { userId: true } },
      comments: { select: { id: true } },
    },
  });

  const allPosts =
    followingIds.length === 0
      ? await prisma.post.findMany({
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            user: { select: { username: true, displayName: true } },
            likes: { select: { userId: true } },
            comments: { select: { id: true } },
          },
        })
      : posts;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Лента</h1>
      <p className="text-sm text-muted mb-6">
        {followingIds.length > 0
          ? "Посты от авторов, на которых вы подписаны"
          : "Подпишитесь на авторов, чтобы видеть их посты. Пока — все посты платформы."}
      </p>

      <div className="mb-6">
        <PostForm />
      </div>

      <div className="space-y-4">
        {allPosts.length === 0 ? (
          <div className="card text-center text-muted py-12">
            Пока нет постов. Будьте первым — напишите что-нибудь!
          </div>
        ) : (
          allPosts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={session.id} />
          ))
        )}
      </div>
    </div>
  );
}
