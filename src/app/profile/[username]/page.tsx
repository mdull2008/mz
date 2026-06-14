import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import FollowButton from "@/components/FollowButton";
import PostCard from "@/components/PostCard";
import StoryCard from "@/components/StoryCard";
import { updateProfileAction } from "@/lib/actions";

type Params = Promise<{ username: string }>;

export default async function ProfilePage({ params }: { params: Params }) {
  const { username } = await params;
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: { select: { username: true, displayName: true } },
          likes: { select: { userId: true } },
          comments: { select: { id: true } },
        },
      },
      stories: {
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { username: true, displayName: true } },
          chapters: { select: { id: true } },
          likes: { select: { id: true } },
        },
      },
      _count: {
        select: { followers: true, following: true },
      },
    },
  });

  if (!user) notFound();

  const isOwnProfile = session?.id === user.id;

  let isFollowing = false;
  if (session && !isOwnProfile) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.id,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold shrink-0">
            {getInitials(user.displayName)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <p className="text-muted">@{user.username}</p>
              </div>
              {session && !isOwnProfile && (
                <FollowButton username={user.username} isFollowing={isFollowing} />
              )}
            </div>
            {user.bio && <p className="mt-3 text-foreground/80">{user.bio}</p>}
            <div className="flex gap-6 mt-4 text-sm">
              <span>
                <strong>{user._count.following}</strong>{" "}
                <span className="text-muted">подписок</span>
              </span>
              <span>
                <strong>{user._count.followers}</strong>{" "}
                <span className="text-muted">подписчиков</span>
              </span>
              <span>
                <strong>{user.stories.length}</strong>{" "}
                <span className="text-muted">фанфиков</span>
              </span>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <form action={updateProfileAction} className="mt-6 pt-6 border-t border-border space-y-3">
            <h3 className="font-semibold text-sm">Редактировать профиль</h3>
            <input
              name="displayName"
              defaultValue={user.displayName}
              className="input-field"
              placeholder="Отображаемое имя"
            />
            <textarea
              name="bio"
              defaultValue={user.bio}
              className="input-field min-h-[80px]"
              placeholder="Расскажите о себе..."
              maxLength={300}
            />
            <button type="submit" className="btn-secondary text-sm">
              Сохранить
            </button>
          </form>
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Блог</h2>
        <div className="space-y-4">
          {user.posts.length === 0 ? (
            <div className="card text-center text-muted py-8">
              {isOwnProfile ? (
                <>
                  Пока нет постов.{" "}
                  <Link href="/feed" className="text-primary hover:underline">
                    Напишите в ленте
                  </Link>
                </>
              ) : (
                "Пока нет постов"
              )}
            </div>
          ) : (
            user.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={session?.id}
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Фанфики</h2>
        <div className="space-y-4">
          {user.stories.length === 0 ? (
            <div className="card text-center text-muted py-8">
              {isOwnProfile ? (
                <>
                  Пока нет фанфиков.{" "}
                  <Link href="/write" className="text-primary hover:underline">
                    Написать первый
                  </Link>
                </>
              ) : (
                "Пока нет фанфиков"
              )}
            </div>
          ) : (
            user.stories.map((story) => <StoryCard key={story.id} story={story} />)
          )}
        </div>
      </section>
    </div>
  );
}
