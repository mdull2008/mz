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
  }

  revalidatePath("/feed");
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
  }

  revalidatePath(`/profile/${username}`);
  revalidatePath("/feed");
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

  const story = await prisma.story.create({
    data: {
      userId: session.id,
      title,
      summary,
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

  await prisma.story.update({
    where: { id: storyId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/stories/${storyId}`);
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
  }

  revalidatePath(`/stories/${storyId}`);
  revalidatePath("/stories");
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

  await prisma.comment.create({
    data: {
      userId: session.id,
      content,
      postId,
      storyId,
      chapterId,
    },
  });

  if (postId) revalidatePath("/feed");
  if (storyId) revalidatePath(`/stories/${storyId}`);
  if (chapterId) {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });
    if (chapter) revalidatePath(`/stories/${chapter.storyId}/chapter/${chapterId}`);
  }

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
