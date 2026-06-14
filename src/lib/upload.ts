import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function saveCoverImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_SIZE) return null;
  if (!ALLOWED_TYPES.includes(file.type)) return null;

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "covers");

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/covers/${filename}`;
}
