import { readFile } from "node:fs/promises";
import path from "node:path";
import manifest from "@/private/photos/manifest.json";
import type { PhotoManifest } from "@/lib/types";

const photoManifest = manifest as PhotoManifest;

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ memory: string; file: string }> },
) {
  const { memory, file } = await params;
  const isKnownFile = photoManifest[memory]?.some(
    (photo) => photo.file === file,
  );
  const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()];
  if (!isKnownFile || !contentType) {
    return new Response("Not found", { status: 404 });
  }

  const bytes = new Uint8Array(
    await readFile(path.join(process.cwd(), "private", "photos", memory, file)),
  );

  return new Response(bytes, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.length),
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
