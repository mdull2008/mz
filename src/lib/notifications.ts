import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "follow"
  | "like_post"
  | "like_story"
  | "comment"
  | "message"
  | "new_chapter";

export async function createNotification(params: {
  userId: string;
  actorId?: string;
  type: NotificationType;
  message: string;
  link?: string;
}) {
  if (params.actorId && params.actorId === params.userId) return;

  await prisma.notification.create({
    data: {
      userId: params.userId,
      actorId: params.actorId,
      type: params.type,
      message: params.message,
      link: params.link || "",
    },
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function getUnreadMessageCount(userId: string) {
  return prisma.message.count({
    where: { receiverId: userId, read: false },
  });
}
