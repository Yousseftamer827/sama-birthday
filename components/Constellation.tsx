"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Point = {
  x: number;
  y: number;
};

const DRAW_EASE = [0.65, 0, 0.35, 1] as const;
const FIRST_DELAY_S = 0.5;
const SEQUENCE_GAP_S = 0.3;
/** A newly opened memory waits for its sheet to slide away before drawing. */
const NEW_LINE_DELAY_S = 0.45;

export function Constellation({ points }: { points: Point[] }) {
  const [initialSegments] = useState(Math.max(0, points.length - 1));

  const segments = [];
  let sequenceDelay = FIRST_DELAY_S;
  for (let index = 1; index < points.length; index++) {
    const from = points[index - 1];
    const to = points[index];
    const duration = 0.9 + Math.hypot(to.x - from.x, to.y - from.y) / 60;
    let delay = NEW_LINE_DELAY_S;
    if (index <= initialSegments) {
      // Lines restored on load trace themselves one after another.
      delay = sequenceDelay;
      sequenceDelay += duration * 0.6 + SEQUENCE_GAP_S;
    }
    segments.push({ from, to, duration, delay });
  }

  return (
    <>
      <svg className="constellation" aria-hidden>
        {segments.map(({ from, to, duration, delay }, index) => (
          <g key={index}>
            {["constellation-glow", "constellation-line"].map((className) => (
              <motion.line
                key={className}
                className={className}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration, delay, ease: DRAW_EASE },
                  opacity: { duration: 0.25, delay },
                }}
              />
            ))}
          </g>
        ))}
      </svg>

      {segments.map(({ from, to, duration, delay }, index) => (
        <div key={index} aria-hidden>
          <motion.span
            className="constellation-spark"
            initial={{
              left: `${from.x}%`,
              top: `${from.y}%`,
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              left: `${to.x}%`,
              top: `${to.y}%`,
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1, 1, 0.5],
            }}
            transition={{
              left: { duration, delay, ease: DRAW_EASE },
              top: { duration, delay, ease: DRAW_EASE },
              opacity: { duration: duration + 0.3, delay, times: [0, 0.12, 0.85, 1] },
              scale: { duration: duration + 0.3, delay, times: [0, 0.12, 0.85, 1] },
            }}
          />
          <motion.span
            className="constellation-ripple"
            style={{ left: `${to.x}%`, top: `${to.y}%` }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.2, 0.6, 1.6] }}
            transition={{
              duration: 1.1,
              delay: delay + duration * 0.9,
              ease: "easeOut",
              times: [0, 0.15, 1],
            }}
          />
        </div>
      ))}
    </>
  );
}