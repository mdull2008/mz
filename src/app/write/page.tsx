import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import WriteStoryForm from "@/components/WriteStoryForm";

export default async function WritePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Написать фанфик</h1>
      <p className="text-muted text-sm mb-8">
        Создайте новую историю с обложкой. Первая глава публикуется вместе с описанием.
      </p>
      <WriteStoryForm />
    </div>
  );
}
