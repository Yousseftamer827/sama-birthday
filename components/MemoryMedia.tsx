"use client";

import type { Photo } from "@/lib/types";

/** One slide in a memory, with wide shots letterboxed. */
export function MemoryMedia({ photo }: { photo: Photo }) {
  const wide = photo.width > photo.height;

  return (
    <div className={`photo ${wide ? "is-wide" : ""}`}>
      {wide && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="photo-fill" src={photo.src} alt="" draggable={false} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="photo-media"
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt=""
        draggable={false}
      />
    </div>
  );
}
