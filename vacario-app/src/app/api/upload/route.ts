import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ok, toResponse, HttpError, requireSessionUser } from "@/lib/api";

const MAX_BYTES = 40 * 1024 * 1024; // 40 MB
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/**
 * Stores media on the local disk under /public/<UPLOAD_DIR>. Hosts with an
 * ephemeral or read-only filesystem should point UPLOAD_DIR at a mounted volume
 * or swap this handler for an S3/Cloudinary upload — the rest of the app only
 * ever sees the returned URL, so nothing else changes.
 */
export async function POST(request: Request) {
  try {
    await requireSessionUser();

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new HttpError("No file received", 400);
    if (file.size === 0) throw new HttpError("That file is empty", 400);
    if (file.size > MAX_BYTES) throw new HttpError("Files must be 40 MB or smaller", 413);

    const extension = EXTENSIONS[file.type];
    if (!extension) throw new HttpError(`Unsupported file type: ${file.type || "unknown"}`, 415);

    const dir = (process.env.UPLOAD_DIR || "uploads").replace(/^\/+|\.\./g, "");
    const target = path.join(process.cwd(), "public", dir);
    await mkdir(target, { recursive: true });

    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
    await writeFile(path.join(target, filename), Buffer.from(await file.arrayBuffer()));

    return ok({
      url: `/${dir}/${filename}`,
      kind: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      size: file.size,
      contentType: file.type,
    }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
