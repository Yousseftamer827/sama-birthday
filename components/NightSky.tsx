"use client";

import React, { useEffect, useRef, useState } from "react";
import { BIRTHDAY_CONFIG, MEMORIES } from "@/lib/content";
import {
  S_CONSTELLATION_POINTS,
  getCakeFormationPoints,
  getNameFormationPoints,
  SkyPoint,
} from "@/lib/sky-engine";

type SkyPhase = "stars" | "cake" | "name" | "letter";

export default function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [activeMemoryIndex, setActiveMemoryIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<SkyPhase>("stars");
  const [viewport, setViewport] = useState({ width: 1024, height: 768 });

  useEffect(() => {
    const updateSize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // رسم السماء، خطوط حرف S، التورتة والشموع، واسم SAMA على Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bgStars = Array.from({ length: 90 }, (_, idx) => ({
      x: ((idx * 197) % 1000) / 1000,
      y: ((idx * 353) % 1000) / 1000,
      r: (idx % 3) * 0.6 + 0.7,
      phase: idx * 0.7,
    }));

    const cakeTargets = getCakeFormationPoints(viewport.width, viewport.height);
    const nameTargets = getNameFormationPoints(viewport.width, viewport.height);

    const render = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, viewport.width, viewport.height);

      // نجوم الخلفية الهادئة
      for (const s of bgStars) {
        const alpha = 0.25 + 0.45 * Math.sin(t * 1.6 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x * viewport.width, s.y * viewport.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 225, ${alpha.toFixed(2)})`;
        ctx.fill();
      }

      const starCoords: SkyPoint[] = S_CONSTELLATION_POINTS.map((p) => ({
        x: p.x * viewport.width,
        y: p.y * viewport.height,
      }));

      if (phase === "stars") {
        // توصيل النجوم المتتالية لتوضيح شكل حرف S
        for (let i = 0; i < starCoords.length - 1; i++) {
          const bothOpened =
            openedIds.includes(MEMORIES[i].id) && openedIds.includes(MEMORIES[i + 1].id);
          ctx.beginPath();
          ctx.moveTo(starCoords[i].x, starCoords[i].y);
          ctx.lineTo(starCoords[i + 1].x, starCoords[i + 1].y);
          ctx.strokeStyle = bothOpened
            ? "rgba(255, 215, 110, 0.9)"
            : "rgba(255, 255, 255, 0.22)";
          ctx.lineWidth = bothOpened ? 2.6 : 1.3;
          ctx.setLineDash(bothOpened ? [] : [5, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else if (phase === "cake") {
        // رسم نقاط التورتة والشموع
        cakeTargets.forEach((pt, idx) => {
          const isFlame = idx >= cakeTargets.length - 3;
          ctx.beginPath();
          ctx.arc(
            pt.x,
            pt.y + Math.sin(t * 3 + idx) * 2,
            isFlame ? 5.5 + Math.sin(t * 10 + idx) * 1.5 : 3.2,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = isFlame ? "rgba(255, 190, 75, 0.95)" : "rgba(255, 232, 175, 0.88)";
          ctx.fill();
        });
      } else if (phase === "name" || phase === "letter") {
        // رسم اسم SAMA من نقاط النجوم
        nameTargets.forEach((pt, idx) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y + Math.sin(t * 2.4 + idx * 0.4) * 2.2, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 224, 130, 0.95)";
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [viewport, openedIds, phase]);

  const handleStarClick = (index: number) => {
    const mem = MEMORIES[index];
    setActiveMemoryIndex(index);
    if (!openedIds.includes(mem.id)) {
      setOpenedIds((prev) => [...prev, mem.id]);
    }
  };

  const handleCloseMemory = () => {
    const allOpened = MEMORIES.every((m) => openedIds.includes(m.id));
    setActiveMemoryIndex(null);

    if (allOpened && phase === "stars") {
      setPhase("cake");
      window.setTimeout(() => {
        setPhase("name");
      }, 3400);
    }
  };

  const activeMemory = activeMemoryIndex !== null ? MEMORIES[activeMemoryIndex] : null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060913] text-white select-none">
      <canvas ref={canvasRef} className="fixed inset-0 h-full w-full pointer-events-none" />

      {/* نجوم حرف S */}
      {phase === "stars" &&
        S_CONSTELLATION_POINTS.map((pt, idx) => {
          const isOpened = openedIds.includes(MEMORIES[idx].id);
          return (
            <button
              key={MEMORIES[idx].id}
              type="button"
              onClick={() => handleStarClick(idx)}
              style={{ left: `${pt.x * 100}%`, top: `${pt.y * 100}%` }}
              className={`-translate-x-1/2 -translate-y-1/2 fixed z-20 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                isOpened
                  ? "border-amber-300 bg-amber-300/25 shadow-[0_0_24px_rgba(251,191,36,0.85)] scale-105"
                  : "border-white/50 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.45)] hover:scale-110"
              }`}
              aria-label={MEMORIES[idx].label}
            >
              <span className="text-sm font-semibold text-amber-100">✦</span>
            </button>
          );
        })}

      {/* تعليمات التوصيل في الأسفل */}
      {phase === "stars" && (
        <div className="fixed bottom-7 left-1/2 z-20 -translate-x-1/2 text-center">
          <p className="text-sm tracking-wide text-amber-100/90">
            {BIRTHDAY_CONFIG.connectInstruction}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {openedIds.length} / {MEMORIES.length}
          </p>
        </div>
      )}

      {/* مرحلة التورتة والشموع */}
      {phase === "cake" && (
        <div className="fixed bottom-12 left-1/2 z-20 -translate-x-1/2 text-center">
          <p className="text-base font-medium text-amber-200">{BIRTHDAY_CONFIG.cakeCaption}</p>
        </div>
      )}

      {/* مرحلة اسم SAMA وزر فتح الجواب */}
      {phase === "name" && (
        <div className="fixed bottom-12 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setPhase("letter")}
            className="rounded-full border border-amber-300/60 bg-amber-400/15 px-6 py-2.5 text-sm font-medium text-amber-100 backdrop-blur-md transition hover:bg-amber-400/25"
          >
            {BIRTHDAY_CONFIG.openLetterLabel}
          </button>
        </div>
      )}

      {/* بطاقة الذكرى (الصورة + Memory X of 4 فقط) */}
      {activeMemory && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0d1326] p-4 text-center shadow-2xl">
            <div className="overflow-hidden rounded-xl bg-black/40">
              <img
                src={`/api/photo/${activeMemory.id}`}
                alt={activeMemory.label}
                className="max-h-[62vh] w-full object-contain"
              />
            </div>
            <p className="mt-3 text-sm font-medium tracking-wide text-amber-200">
              {activeMemory.label}
            </p>
            <button
              type="button"
              onClick={handleCloseMemory}
              className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 py-2 text-sm text-white transition hover:bg-white/20"
            >
              {BIRTHDAY_CONFIG.backToStarsLabel}
            </button>
          </div>
        </div>
      )}

      {/* صفحة الجواب النهائية */}
      {phase === "letter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-md">
          <div
            dir="rtl"
            className="w-full max-w-md rounded-3xl border border-amber-200/25 bg-[#0d1326] p-6 text-right shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-amber-200">{BIRTHDAY_CONFIG.letterTitle}</h2>
            <p className="mt-4 leading-8 text-base text-white/95">{BIRTHDAY_CONFIG.letterBody}</p>
            <button
              type="button"
              onClick={() => setPhase("name")}
              className="mt-6 w-full rounded-xl border border-white/15 bg-white/10 py-2.5 text-center text-sm text-amber-100 transition hover:bg-white/20"
            >
              رجوع
            </button>
          </div>
        </div>
      )}
    </div>
  );
}