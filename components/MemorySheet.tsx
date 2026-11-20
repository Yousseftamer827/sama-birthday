"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useDragControls,
  type PanInfo,
  type Variants,
} from "motion/react";
import { MemoryMedia } from "@/components/MemoryMedia";
import type { Memory } from "@/lib/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.55, 0, 0.75, 0.2] as const;
const SHEET_SPRING = { type: "spring", stiffness: 300, damping: 34 } as const;
const DISMISS_OFFSET_PX = 110;
const DISMISS_VELOCITY = 550;

const body: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

export function MemorySheet({
  memory,
  index,
  total,
  onClose,
}: {
  memory: Memory;
  index: number;
  total: number;
  onClose: () => void;
}) {
  const [activePhoto, setActivePhoto] = useState(0);
  const dragControls = useDragControls();
  // The sheet stays mounted during its exit animation; close only once.
  const closed = useRef(false);

  function close() {
    if (closed.current) return;
    closed.current = true;
    onClose();
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  function handleDragEnd(_: PointerEvent, info: PanInfo) {
    if (
      info.offset.y > DISMISS_OFFSET_PX ||
      info.velocity.y > DISMISS_VELOCITY
    ) {
      close();
    }
  }

  return (
    <motion.div
      className="sheet-backdrop"
      onClick={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <motion.article
        className="sheet"
        role="dialog"
        aria-modal
        aria-label={`Memory ${index + 1}`}
        onClick={(event) => event.stopPropagation()}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%", transition: { duration: 0.38, ease: EASE_IN } }}
        transition={SHEET_SPRING}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.04, bottom: 0.9 }}
        onDragEnd={handleDragEnd}
      >
        <div
          className="sheet-handle"
          onPointerDown={(event) => dragControls.start(event)}
          aria-hidden
        >
          <span />
        </div>

        {memory.photos.length > 0 ? (
          <motion.div
            className="photos"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <div
              className="photo-track"
              onScroll={(event) => {
                const track = event.currentTarget;
                setActivePhoto(
                  Math.round(track.scrollLeft / track.clientWidth),
                );
              }}
            >
              {memory.photos.map((photo) => (
                <MemoryMedia key={photo.src} photo={photo} />
              ))}
            </div>
            {memory.photos.length > 1 && (
              <div className="photo-dots" aria-hidden>
                {memory.photos.map((photo, photoIndex) => (
                  <span
                    key={photo.src}
                    className={photoIndex === activePhoto ? "is-active" : ""}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="photo-empty" aria-hidden>
            <span className="photo-empty-star" />
          </div>
        )}

        <motion.div
          className="sheet-body"
          variants={body}
          initial="hidden"
          animate="shown"
        >
          <motion.p className="eyebrow" variants={item}>
            Memory {index + 1} of {total}
          </motion.p>
          <motion.div className="sheet-actions" variants={item}>
            <button
              className="button button-ghost"
              type="button"
              onClick={close}
            >
              Back to the stars
            </button>
          </motion.div>
        </motion.div>
      </motion.article>
    </motion.div>
  );
}
