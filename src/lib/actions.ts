"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  COOKIE_NAME,
  createToken,
  hashPassword,
  requireSession,
  verifyPassword,
} from "@/lib/auth";
import { countWords } from "@/lib/utils";
import { saveCoverImage } from "@/lib/upload";
import { createNotification } from "@/lib/notifications";

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !username || !displayName || password.length < 6) {
    return { error: "Заполните все поля. Пароль — минимум 6 символов." };
  }

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return { error: "Имя пользователя: 3–20 символов, только буквы, цифры и _" };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return { error: "Email или имя пользователя уже заняты" };
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, username, displayName, password: hashed },
  });

  const token = await createToken({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/feed");
}

export async function loginAction(formData: FormData) {
  const login = String(formData.get("login") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: login }, { username: login }] },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    return { error: "Неверный логин или пароль" };
  }

  const token = await createToken({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/feed");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/");
}

export async function createPostAction(formData: FormData) {
  const session = await requireSession();
  const content = String(formData.get("content") || "").trim();

  if (!content || content.length > 500) {
    return { error: "Пост должен быть от 1 до 500 символов" };
  }

  await prisma.post.create({
    data: { userId: session.id, content },
  });

  revalidatePath("/feed");
  revalidatePath(`/profile/${session.username}`);
  return { success: true };
}

export async function togglePostLikeAction(postId: string): Promise<void> {
  const session = await requireSession();

  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId: session.id, postId } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.postLike.create({
      data: { userId: session.id, postId },
    });
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { user: { select: { id: true } } },
    });
    if (post && post.userId !== session.id) {
      await createNotification({
        userId: post.userId,
        actorId: session.id,
        type: "like_post",
        message: `${session.displayName} понравился ваш пост`,
        link: "/feed",
      });
    }
  }

  revalidatePath("/feed");
  revalidatePath("/notifications");
}

export async function toggleFollowAction(username: string): Promise<void> {
  const session = await requireSession();
  const target = await prisma.user.findUnique({ where: { username } });

  if (!target || target.id === session.id) return;

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.id,
        followingId: target.id,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: { followerId: session.id, followingId: target.id },
    });
    await createNotification({
      userId: target.id,
      actorId: session.id,
      type: "follow",
      message: `${session.displayName} подписался(ась) на вас`,
      link: `/profile/${session.username}`,
    });
  }

  revalidatePath(`/profile/${username}`);
  revalidatePath("/feed");
  revalidatePath("/notifications");
}

export async function createStoryAction(formData: FormData): Promise<void> {
  const session = await requireSession();

  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const fandom = String(formData.get("fandom") || "").trim();
  const rating = String(formData.get("rating") || "T");
  const status = String(formData.get("status") || "ongoing");
  const tags = String(formData.get("tags") || "").trim();
  const chapterTitle = String(formData.get("chapterTitle") || "Глава 1").trim();
  const chapterContent = String(formData.get("chapterContent") || "").trim();

  if (!title || !summary || !fandom || !chapterContent) return;

  const coverFile = formData.get("cover");
  let cover = "";
  if (coverFile instanceof File) {
    const saved = await saveCoverImage(coverFile);
    if (saved) cover = saved;
  }

  const story = await prisma.story.create({
    data: {
      userId: session.id,
      title,
      summary,
      cover,
      fandom,
      rating,
      status,
      tags,
      chapters: {
        create: {
          number: 1,
          title: chapterTitle,
          content: chapterContent,
          wordCount: countWords(chapterContent),
        },
      },
    },
  });

  redirect(`/stories/${story.id}`);
}

export async function addChapterAction(storyId: string, formData: FormData): Promise<void> {
  const session = await requireSession();

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
  });

  if (!story || story.userId !== session.id) return;

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!title || !content) return;

  const nextNumber = (story.chapters[0]?.number ?? 0) + 1;

  await prisma.chapter.create({
    data: {
      storyId,
      number: nextNumber,
      title,
      content,
      wordCount: countWords(content),
    },
  });

  const followers = await prisma.follow.findMany({
    where: { followingId: session.id },
    select: { followerId: true },
  });

  await Promise.all(
    followers.map((f) =>
      createNotification({
        userId: f.followerId,
        actorId: session.id,
        type: "new_chapter",
        message: `${session.displayName} опубликовал(а) главу «${title}»`,
        link: `/stories/${storyId}`,
      })
    )
  );

  await prisma.story.update({
    where: { id: storyId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath("/notifications");
  redirect(`/stories/${storyId}`);
}

export async function toggleStoryLikeAction(storyId: string): Promise<void> {
  const session = await requireSession();

  const existing = await prisma.storyLike.findUnique({
    where: { userId_storyId: { userId: session.id, storyId } },
  });

  if (existing) {
    await prisma.storyLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.storyLike.create({
      data: { userId: session.id, storyId },
    });
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { userId: true, title: true },
    });
    if (story && story.userId !== session.id) {
      await createNotification({
        userId: story.userId,
        actorId: session.id,
        type: "like_story",
        message: `${session.displayName} понравился фанфик «${story.title}»`,
        link: `/stories/${storyId}`,
      });
    }
  }

  revalidatePath(`/stories/${storyId}`);
  revalidatePath("/stories");
  revalidatePath("/notifications");
}

export async function toggleBookmarkAction(storyId: string): Promise<void> {
  const session = await requireSession();

  const existing = await prisma.bookmark.findUnique({
    where: { userId_storyId: { userId: session.id, storyId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({
      data: { userId: session.id, storyId },
    });
  }

  revalidatePath(`/stories/${storyId}`);
}

export async function addCommentAction(formData: FormData) {
  const session = await requireSession();
  const content = String(formData.get("content") || "").trim();
  const postId = String(formData.get("postId") || "") || null;
  const storyId = String(formData.get("storyId") || "") || null;
  const chapterId = String(formData.get("chapterId") || "") || null;

  if (!content) return { error: "Комментарий не может быть пустым" };

  const comment = await prisma.comment.create({
    data: {
      userId: session.id,
      content,
      postId,
      storyId,
      chapterId,
    },
  });

  if (postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.userId !== session.id) {
      await createNotification({
        userId: post.userId,
        actorId: session.id,
        type: "comment",
        message: `${session.displayName} прокомментировал(а) ваш пост`,
        link: "/feed",
      });
    }
  }

  if (storyId) {
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (story && story.userId !== session.id) {
      await createNotification({
        userId: story.userId,
        actorId: session.id,
        type: "comment",
        message: `${session.displayName} оставил(а) комментарий к «${story.title}»`,
        link: `/stories/${storyId}`,
      });
    }
  }

  if (chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { story: { select: { userId: true, title: true, id: true } } },
    });
    if (chapter && chapter.story.userId !== session.id) {
      await createNotification({
        userId: chapter.story.userId,
        actorId: session.id,
        type: "comment",
        message: `${session.displayName} прокомментировал(а) главу «${chapter.title}»`,
        link: `/stories/${chapter.story.id}/chapter/${chapterId}`,
      });
    }
  }

  void comment;

  if (postId) revalidatePath("/feed");
  if (storyId) revalidatePath(`/stories/${storyId}`);
  if (chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });
    if (chapter) revalidatePath(`/stories/${chapter.storyId}/chapter/${chapterId}`);
  }

  revalidatePath("/notifications");
  return { success: true };
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const session = await requireSession();

  const displayName = String(formData.get("displayName") || "").trim();
  const bio = String(formData.get("bio") || "").trim();

  if (!displayName) return;

  await prisma.user.update({
    where: { id: session.id },
    data: { displayName, bio },
  });

  revalidatePath(`/profile/${session.username}`);
}

export async function uploadStoryCoverAction(storyId: string, formData: FormData): Promise<void> {
  const session = await requireSession();

  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story || story.userId !== session.id) return;

  const coverFile = formData.get("cover");
  if (!(coverFile instanceof File)) return;

  const saved = await saveCoverImage(coverFile);
  if (!saved) return;

  await prisma.story.update({
    where: { id: storyId },
    data: { cover: saved },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath("/stories");
}

export async function sendMessageAction(formData: FormData) {
  const session = await requireSession();
  const receiverUsername = String(formData.get("receiver") || "").trim().toLowerCase();
  const content = String(formData.get("content") || "").trim();

  if (!receiverUsername || !content || content.length > 2000) {
    return { error: "Сообщение должно быть от 1 до 2000 символов" };
  }

  const receiver = await prisma.user.findUnique({
    where: { username: receiverUsername },
  });

  if (!receiver || receiver.id === session.id) {
    return { error: "Пользователь не найден" };
  }

  await prisma.message.create({
    data: {
      senderId: session.id,
      receiverId: receiver.id,
      content,
    },
  });

  await createNotification({
    userId: receiver.id,
    actorId: session.id,
    type: "message",
    message: `${session.displayName} отправил(а) вам сообщение`,
    link: `/messages/${session.username}`,
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${receiverUsername}`);
  revalidatePath("/notifications");
  return { success: true };
}

export async function markNotificationsReadAction(): Promise<void> {
  const session = await requireSession();

  await prisma.notification.updateMany({
    where: { userId: session.id, read: false },
    data: { read: true },
  });

  revalidatePath("/notifications");
}

export async function markConversationReadAction(username: string): Promise<void> {
  const session = await requireSession();
  const other = await prisma.user.findUnique({ where: { username } });
  if (!other) return;

  await prisma.message.updateMany({
    where: {
      senderId: other.id,
      receiverId: session.id,
      read: false,
    },
    data: { read: true },
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${username}`);
}
