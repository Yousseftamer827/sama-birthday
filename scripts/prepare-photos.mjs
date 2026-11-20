import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const INPUT_DIR = path.resolve("photos");
const OUTPUT_DIR = path.resolve("private", "photos");
const MAX_EDGE_PX = 1600;
const WEBP_QUALITY = 80;
const IMAGE = /\.(jpe?g|png|webp|avif|heic|heif|tiff?)$/i;

async function convertImage(input, outputDir, base) {
  const file = `${base}.webp`;
  const { width, height } = await sharp(input)
    .rotate()
    .resize({
      width: MAX_EDGE_PX,
      height: MAX_EDGE_PX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(path.join(outputDir, file));
  return { file, width, height };
}

const memoryDirs = (await readdir(INPUT_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });

const manifest = {};
const failures = [];

for (const memoryId of memoryDirs) {
  const files = (await readdir(path.join(INPUT_DIR, memoryId)))
    .filter((file) => IMAGE.test(file))
    .sort();
  if (files.length === 0) continue;

  const outputDir = path.join(OUTPUT_DIR, memoryId);
  await mkdir(outputDir, { recursive: true });
  manifest[memoryId] = [];

  for (const [index, file] of files.entries()) {
    const base = String(index + 1).padStart(2, "0");
    const input = path.join(INPUT_DIR, memoryId, file);
    try {
      manifest[memoryId].push(await convertImage(input, outputDir, base));
    } catch (error) {
      failures.push(`${memoryId}/${file}: ${error.message}`);
    }
  }

  console.log(`${memoryId}: ${manifest[memoryId].length} photo(s)`);
}

await writeFile(
  path.join(OUTPUT_DIR, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

if (failures.length > 0) {
  console.error(
    "\nCould not convert these (HEIC usually needs converting to JPG first):",
  );
  failures.forEach((failure) => console.error(`  ${failure}`));
  process.exitCode = 1;
}
