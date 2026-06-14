import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("demo123", 10);

  const author1 = await prisma.user.upsert({
    where: { email: "anna@ficpulse.ru" },
    update: {},
    create: {
      email: "anna@ficpulse.ru",
      username: "anna_writer",
      displayName: "Анна Пишущая",
      password,
      bio: "Пишу фанфики по HP и Marvel. Люблю AU и романтику 💜",
    },
  });

  const author2 = await prisma.user.upsert({
    where: { email: "max@ficpulse.ru" },
    update: {},
    create: {
      email: "max@ficpulse.ru",
      username: "max_reader",
      displayName: "Макс Читатель",
      password,
      bio: "Читаю всё подряд. Иногда пишу рецензии.",
    },
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: author2.id,
        followingId: author1.id,
      },
    },
    update: {},
    create: { followerId: author2.id, followingId: author1.id },
  });

  const story = await prisma.story.upsert({
    where: { id: "seed-story-1" },
    update: {},
    create: {
      id: "seed-story-1",
      userId: author1.id,
      title: "Тени Хогвартса",
      summary:
        "Что если бы Гарри узнал правду о своих родителях раньше? AU, в котором всё идёт иначе. Романтика, драма, магия.",
      fandom: "Harry Potter",
      rating: "T",
      status: "ongoing",
      tags: "AU, романтика, драма, Гарри/Драко",
      chapters: {
        create: [
          {
            number: 1,
            title: "Письмо, которого не было",
            content: `Гарри Поттер сидел на подоконнике маленькой спальни под лестницей и смотрел на сову, которая упорно стучалась в стекло.

Он никогда не видел сов, которые доставляют почту. Особенно — сов, которые приносят письма с красными печатями и надписью «Срочно».

«Мальчик, который выжил», — прочитал он вслух, и сердце ёкнуло.

В этой версии истории письмо пришло не в одиннадцать лет. Оно пришло сегодня. И с ним — правда, которую Дурсли так отчаянно скрывали.

Гарри открыл конверт дрожащими руками...`,
            wordCount: 85,
          },
          {
            number: 2,
            title: "Первый день в другой жизни",
            content: `Когда Гарри вошёл в зал Великого зала, шёпот прокатился по длинным столам.

Он ожидал любопытных взглядов — мальчик, который выжил, всегда привлекает внимание. Но не ожидал, что кто-то встанет навстречу.

— Поттер, — сказал блондин из стола Слизерина. — Наконец-то. Я думал, ты не придёшь.

Гарри замер. Драко Малфой улыбался. Не насмешливо. Почти... радостно.

— Мы знакомы? — спросил Гарри.

— Ещё нет, — ответил Драко. — Но будем.`,
            wordCount: 72,
          },
        ],
      },
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-1" },
    update: {},
    create: {
      id: "seed-post-1",
      userId: author1.id,
      content:
        "Вышла вторая глава «Теней Хогвартса»! 🔥 Спасибо всем за поддержку. Следующая глава — в субботу.",
    },
  });

  await prisma.post.upsert({
    where: { id: "seed-post-2" },
    update: {},
    create: {
      id: "seed-post-2",
      userId: author2.id,
      content:
        "Только что дочитал невероятный фанфик по Marvel. Кто-нибудь знает хорошие работы по Локи? Рекомендуйте в комментариях!",
    },
  });

  try {
    await prisma.storyLike.create({
      data: { userId: author2.id, storyId: story.id },
    });
  } catch {
    // already exists
  }

  console.log("Seed completed!");
  console.log("Demo accounts:");
  console.log("  anna_writer / demo123");
  console.log("  max_reader / demo123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
