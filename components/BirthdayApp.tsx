"use client";

import React, { useEffect, useRef, useState } from "react";
import { BIRTHDAY_CONFIG } from "@/lib/content";
import { birthdayMusic } from "@/lib/birthday-music";

type Stage = "lock" | "intro" | "sky" | "cake" | "finale";

const MEMORIES = [
  { id: "01", x: 68, y: 18, src: "/photos/01.jpeg" },
  { id: "02", x: 32, y: 32, src: "/photos/02.jpeg" },
  { id: "03", x: 68, y: 50, src: "/photos/03.jpeg" },
  { id: "04", x: 32, y: 64, src: "/photos/04.jpeg" },
];

const S_SEGMENTS = [
  { fromId: "01", toId: "02", d: "M 68 18 C 56 9, 32 15, 32 32", fromX: 68, fromY: 18, toX: 32, toY: 32 },
  { fromId: "02", toId: "03", d: "M 32 32 C 32 43, 68 39, 68 50", fromX: 32, fromY: 32, toX: 68, toY: 50 },
  { fromId: "03", toId: "04", d: "M 68 50 C 68 66, 44 73, 32 64", fromX: 68, fromY: 50, toX: 32, toY: 64 },
];

function generateMemoryArtwork(id: string) {
  const w = 640;
  const h = 800;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return "";

  if (id === "01") {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#1d1828");
    bg.addColorStop(0.5, "#312839");
    bg.addColorStop(1, "#12101e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const light = ctx.createRadialGradient(w * 0.5, h * 0.34, 24, w * 0.5, h * 0.38, 420);
    light.addColorStop(0, "rgba(255, 236, 212, 0.34)");
    light.addColorStop(0.55, "rgba(218, 198, 184, 0.12)");
    light.addColorStop(1, "rgba(18, 16, 30, 0)");
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255, 217, 138, 0.45)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(46, 54, w - 92, h - 108);

    ctx.fillStyle = "rgba(18, 15, 28, 0.88)";
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h - 54);
    ctx.quadraticCurveTo(w * 0.24, h * 0.54, w * 0.35, h * 0.44);
    ctx.quadraticCurveTo(w * 0.33, h * 0.24, w * 0.5, h * 0.22);
    ctx.quadraticCurveTo(w * 0.67, h * 0.24, w * 0.65, h * 0.44);
    ctx.quadraticCurveTo(w * 0.76, h * 0.54, w * 0.78, h - 54);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 224, 168, 0.72)";
    ctx.lineWidth = 2.2;
    ctx.strokeRect(w * 0.405, h * 0.33, 46, 25);
    ctx.strokeRect(w * 0.52, h * 0.33, 46, 25);
    ctx.beginPath();
    ctx.moveTo(w * 0.405 + 46, h * 0.345);
    ctx.lineTo(w * 0.52, h * 0.345);
    ctx.stroke();

    ctx.fillStyle = "rgba(38, 32, 52, 0.96)";
    ctx.strokeStyle = "rgba(255, 217, 138, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(w * 0.44, h * 0.47, 58, 100, 12);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 196, 176, 0.92)";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.49);
    ctx.bezierCurveTo(w * 0.68, h * 0.45, w * 0.71, h * 0.54, w * 0.6, h * 0.59);
    ctx.stroke();
  } else if (id === "02") {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.54);
    sky.addColorStop(0, "#0b142b");
    sky.addColorStop(0.58, "#1e3757");
    sky.addColorStop(1, "#52657d");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const sunGlow = ctx.createRadialGradient(w * 0.28, h * 0.45, 10, w * 0.28, h * 0.45, 260);
    sunGlow.addColorStop(0, "rgba(255, 210, 150, 0.36)");
    sunGlow.addColorStop(1, "rgba(255, 210, 150, 0)");
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, w, h * 0.6);

    const sea = ctx.createLinearGradient(0, h * 0.44, 0, h);
    sea.addColorStop(0, "#1f516b");
    sea.addColorStop(0.55, "#13374d");
    sea.addColorStop(1, "#0b1e2e");
    ctx.fillStyle = sea;
    ctx.fillRect(0, h * 0.44, w, h * 0.56);

    for (let row = 0; row < 7; row++) {
      const y = h * (0.48 + row * 0.062);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 36) {
        ctx.lineTo(x, y + Math.sin(x * 0.022 + row) * 6);
      }
      ctx.strokeStyle = `rgba(222, 244, 255, ${0.46 - row * 0.04})`;
      ctx.lineWidth = 3 - row * 0.25;
      ctx.stroke();
    }

    ctx.fillStyle = "#191f28";
    ctx.beginPath();
    ctx.moveTo(w * 0.16, h);
    ctx.lineTo(w * 0.42, h * 0.54);
    ctx.lineTo(w, h * 0.58);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  } else if (id === "03") {
    const wall = ctx.createLinearGradient(0, 0, w, h);
    wall.addColorStop(0, "#240814");
    wall.addColorStop(0.5, "#3b0c2e");
    wall.addColorStop(1, "#160824");
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);

    const neonPink = ctx.createRadialGradient(w * 0.78, h * 0.35, 10, w * 0.78, h * 0.35, 360);
    neonPink.addColorStop(0, "rgba(255, 56, 184, 0.48)");
    neonPink.addColorStop(0.6, "rgba(180, 32, 160, 0.18)");
    neonPink.addColorStop(1, "rgba(22, 8, 36, 0)");
    ctx.fillStyle = neonPink;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.shadowColor = "#ff9924";
    ctx.shadowBlur = 22;
    ctx.strokeStyle = "#ffd98a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(56, 185);
    ctx.lineTo(295, 310);
    ctx.lineTo(56, 390);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "#ffe5a8";
    ctx.font = 'italic 700 34px Georgia, "Times New Roman", serif';
    ctx.textAlign = "left";
    ctx.fillText("Bounce", 78, 278);
    ctx.fillText("Break Zone", 74, 332);
    ctx.restore();
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#2b091c");
    bg.addColorStop(0.55, "#47113b");
    bg.addColorStop(1, "#140924");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const radiance = ctx.createRadialGradient(w * 0.5, h * 0.42, 15, w * 0.5, h * 0.42, 340);
    radiance.addColorStop(0, "rgba(255, 217, 138, 0.38)");
    radiance.addColorStop(0.45, "rgba(255, 110, 185, 0.28)");
    radiance.addColorStop(1, "rgba(20, 9, 36, 0)");
    ctx.fillStyle = radiance;
    ctx.fillRect(0, 0, w, h);

    [
      [w * 0.5, h * 0.38, 28],
      [w * 0.34, h * 0.3, 15],
      [w * 0.68, h * 0.32, 17],
      [w * 0.62, h * 0.54, 13],
      [w * 0.36, h * 0.52, 12],
    ].forEach(([sx, sy, sr]) => {
      ctx.strokeStyle = "rgba(255, 238, 195, 0.92)";
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(sx - sr, sy);
      ctx.lineTo(sx + sr, sy);
      ctx.moveTo(sx, sy - sr);
      ctx.lineTo(sx, sy + sr);
      ctx.stroke();
    });
  }

  return c.toDataURL("image/png");
}

function playCandleBlowSound() {
  try {
    const musicAny = birthdayMusic as unknown as Record<string, unknown>;
    if (typeof musicAny.playCandleBlow === "function") {
      (musicAny.playCandleBlow as () => void)();
      return;
    }
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      birthdayMusic.playUnlockSuccess();
      return;
    }
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // نفخة هواء ناعمة
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(680, now);
    filter.frequency.exponentialRampToValueAtTime(240, now + 0.42);
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.45);

    // نغمة احتفالية خفيفة بعد النفخة
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + 0.16 + idx * 0.08);
      oscGain.gain.setValueAtTime(0.001, now + 0.16 + idx * 0.08);
      oscGain.gain.linearRampToValueAtTime(0.06, now + 0.19 + idx * 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.75 + idx * 0.08);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + 0.16 + idx * 0.08);
      osc.stop(now + 0.8 + idx * 0.08);
    });
  } catch {
    birthdayMusic.playUnlockSuccess();
  }
}

export function BirthdayApp(_props?: { content?: unknown }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fxRef = useRef<HTMLDivElement | null>(null);
  const cakeTimerRef = useRef<number | null>(null);
  const constellationCelebrationTimerRef = useRef<number | null>(null);
  const drawnSegmentsRef = useRef<Set<number>>(new Set());

  const skyStateRef = useRef<{
    width: number;
    height: number;
    mode: "drift" | "cake" | "name";
    formStart: number;
    nextShootAt: number;
    nextRainAt: number;
    wishRainActive: boolean;
    tiltX: number;
    tiltY: number;
    tiltTargetX: number;
    tiltTargetY: number;
    stars: Array<Record<string, unknown>>;
    shootingStars: Array<{ x: number; y: number; vx: number; vy: number; life: number; duration: number; length: number }>;
    candleFlames: Array<{ x: number; y: number; phase: number }>;
    sparkles: Array<{ x: number; y: number; vx: number; vy: number; life: number; duration: number; size: number; sprite: HTMLCanvasElement }>;
    ripples: Array<{ x: number; y: number; life: number; duration: number; maxRadius: number }>;
    pointerLine: Array<{ x: number; y: number; time: number }>;
    wishRain: Array<{ x: number; y: number; vy: number; swayPhase: number; swayAmp: number; size: number; alpha: number; sprite: HTMLCanvasElement }>;
    sprites: Record<string, HTMLCanvasElement> | null;
  }>({
    width: 0,
    height: 0,
    mode: "drift",
    formStart: 0,
    nextShootAt: performance.now() + 2400,
    nextRainAt: 0,
    wishRainActive: false,
    tiltX: 0,
    tiltY: 0,
    tiltTargetX: 0,
    tiltTargetY: 0,
    stars: [],
    shootingStars: [],
    candleFlames: [],
    sparkles: [],
    ripples: [],
    pointerLine: [],
    wishRain: [],
    sprites: null,
  });

  const [stage, setStage] = useState<Stage>("lock");
  const [digits, setDigits] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [namePulsing, setNamePulsing] = useState(false);
  const [constellationFading, setConstellationFading] = useState(false);
  const [sGlowing, setSGlowing] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);

  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [activeMemoryIdx, setActiveMemoryIdx] = useState<number | null>(null);
  const [photoSrc, setPhotoSrc] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);

  const unlockAudio = () => {
    birthdayMusic.startAlways();
  };

  useEffect(() => {
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const st = skyStateRef.current;
    const onMove = (e: PointerEvent) => {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);

      if (e.pointerType === "mouse") {
        st.tiltTargetX = Math.max(-1, Math.min(1, (e.clientX / w) * 2 - 1));
        st.tiltTargetY = Math.max(-1, Math.min(1, (e.clientY / h) * 2 - 1));
      }

      // إضافة نقطة لمسار الخط المضيء
      st.pointerLine.push({ x: e.clientX, y: e.clientY, time: performance.now() });
      if (st.pointerLine.length > 26) {
        st.pointerLine.shift();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const st = skyStateRef.current;

    const makeGlow = (r: number, g: number, b: number) => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const gctx = c.getContext("2d");
      if (gctx) {
        const half = size / 2;
        const grad = gctx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.14, "rgba(255,255,255,0.88)");
        grad.addColorStop(0.3, `rgba(${r},${g},${b},0.36)`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},0.08)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        gctx.fillStyle = grad;
        gctx.fillRect(0, 0, size, size);
      }
      return c;
    };

    const makeFlare = (r: number, g: number, b: number) => {
      const size = 128;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const fctx = c.getContext("2d");
      if (fctx) {
        const half = size / 2;
        fctx.globalCompositeOperation = "lighter";

        const hGrad = fctx.createLinearGradient(0, half, size, half);
        hGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        hGrad.addColorStop(0.36, `rgba(${r},${g},${b},0.16)`);
        hGrad.addColorStop(0.5, "rgba(255,255,255,0.95)");
        hGrad.addColorStop(0.64, `rgba(${r},${g},${b},0.16)`);
        hGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        fctx.fillStyle = hGrad;
        fctx.fillRect(0, half - 1.5, size, 3);

        const vGrad = fctx.createLinearGradient(half, 0, half, size);
        vGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        vGrad.addColorStop(0.36, `rgba(${r},${g},${b},0.16)`);
        vGrad.addColorStop(0.5, "rgba(255,255,255,0.95)");
        vGrad.addColorStop(0.64, `rgba(${r},${g},${b},0.16)`);
        vGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        fctx.fillStyle = vGrad;
        fctx.fillRect(half - 1.5, 0, 3, size);
      }
      return c;
    };

    if (!st.sprites) {
      st.sprites = {
        cool: makeGlow(196, 212, 255),
        white: makeGlow(238, 240, 255),
        warm: makeGlow(255, 226, 196),
        gold: makeGlow(255, 217, 138),
        rose: makeGlow(255, 167, 189),
        flareCool: makeFlare(196, 212, 255),
        flareGold: makeFlare(255, 217, 138),
      };
    }

    const makeStar = (nx: number, ny: number, spawned = false) => {
      const radius = 0.4 + Math.pow(Math.random(), 2.1) * 1.4;
      const r = Math.random();
      const sprite =
        r < 0.48 ? st.sprites!.cool : r < 0.84 ? st.sprites!.white : st.sprites!.warm;
      return {
        nx,
        ny,
        radius,
        alpha: 0.4 + Math.random() * 0.55,
        speed: 0.6 + Math.random() * 2.0,
        phase: Math.random() * Math.PI * 2,
        depth: 0.18 + Math.random() * 0.82,
        sprite,
        flare: radius > 1.32 && Math.random() < 0.55,
        spawned,
        inShape: false,
        fromX: 0,
        fromY: 0,
        ctrlX: 0,
        ctrlY: 0,
        toX: 0,
        toY: 0,
        delay: 0,
        weight: 1,
        shapeSprite: st.sprites!.gold,
        x: 0,
        y: 0,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.width = window.innerWidth;
      st.height = window.innerHeight;
      canvas.width = Math.round(st.width * dpr);
      canvas.height = Math.round(st.height * dpr);
      canvas.style.width = `${st.width}px`;
      canvas.style.height = `${st.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const count = Math.min(340, Math.max(180, Math.round((st.width * st.height) / 2500)));
    st.stars = Array.from({ length: count }, () => makeStar(Math.random(), Math.random(), false));
    window.addEventListener("resize", resize);

    let rafId = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;

      st.tiltX += (st.tiltTargetX - st.tiltX) * 0.08;
      st.tiltY += (st.tiltTargetY - st.tiltY) * 0.08;
      document.documentElement.style.setProperty("--tilt-x", st.tiltX.toFixed(3));
      document.documentElement.style.setProperty("--tilt-y", st.tiltY.toFixed(3));

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, st.width, st.height);
      ctx.globalCompositeOperation = "lighter";

      const elapsed = now - st.formStart;
      const isForming = st.mode === "cake" || st.mode === "name";
      const bgDim = isForming ? 1 - Math.min(1, elapsed / 1800) * 0.5 : 1;

      for (const s of st.stars) {
        const twinkle =
          0.74 +
          0.16 * Math.sin(now * 0.0011 * (s.speed as number) + (s.phase as number)) +
          0.1 * Math.sin(now * 0.0026 * (s.speed as number) + (s.phase as number) * 1.6);

        if (!s.inShape) {
          const bob = Math.sin(now * 0.00016 * (s.speed as number) + (s.phase as number)) * 2;
          const x = (s.nx as number) * st.width + st.tiltX * (s.depth as number) * 22;
          const y = (s.ny as number) * st.height + st.tiltY * (s.depth as number) * 22 + bob;
          s.x = x;
          s.y = y;

          const alpha = (s.alpha as number) * twinkle * bgDim;
          const size = 2.5 + (s.radius as number) * 8.5;
          ctx.globalAlpha = alpha;
          ctx.drawImage(s.sprite as HTMLCanvasElement, x - size / 2, y - size / 2, size, size);

          if (s.flare) {
            const fSize = (s.radius as number) * 20 * (0.78 + 0.22 * twinkle);
            ctx.globalAlpha = alpha * 0.6;
            ctx.drawImage(st.sprites!.flareCool, x - fSize / 2, y - fSize / 2, fSize, fSize);
          }
        } else {
          const local = Math.max(0, elapsed - (s.delay as number));
          const rawT = Math.min(1, local / 1700);
          const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
          const u = 1 - t;
          const floatX =
            Math.sin(now * 0.0008 * (s.speed as number) + (s.phase as number)) * 0.85 * t +
            st.tiltX * 8 * t;
          const floatY =
            Math.cos(now * 0.0009 * (s.speed as number) + (s.phase as number)) * 0.85 * t +
            st.tiltY * 8 * t;
          const x =
            u * u * (s.fromX as number) +
            2 * u * t * (s.ctrlX as number) +
            t * t * (s.toX as number) +
            floatX;
          const y =
            u * u * (s.fromY as number) +
            2 * u * t * (s.ctrlY as number) +
            t * t * (s.toY as number) +
            floatY;
          s.x = x;
          s.y = y;

          const size = (4.5 + (s.weight as number) * 9.5) * (0.7 + 0.3 * t);
          ctx.globalAlpha = Math.min(1, (s.weight as number) * (0.78 + 0.22 * twinkle));
          ctx.drawImage(s.shapeSprite as HTMLCanvasElement, x - size / 2, y - size / 2, size, size);
        }
      }

      // رسم الخط المضيء ورا حركة الماوس/اللمس
      st.pointerLine = st.pointerLine.filter((pt) => now - pt.time < 420);
      if (st.pointerLine.length > 1) {
        for (let i = 1; i < st.pointerLine.length; i++) {
          const prev = st.pointerLine[i - 1];
          const curr = st.pointerLine[i];
          const ageRatio = 1 - (now - curr.time) / 420;
          if (ageRatio <= 0) continue;

          ctx.globalAlpha = Math.max(0, ageRatio * 0.52);
          ctx.strokeStyle = "rgba(255, 224, 158, 0.88)";
          ctx.lineWidth = Math.max(1, ageRatio * 3.2);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.stroke();
        }
      }

      // مطر احتفالي مستمر خفيف بعد إطفاء الشموع
      if (st.wishRainActive && now > st.nextRainAt && st.wishRain.length < 42 && st.sprites) {
        st.wishRain.push({
          x: Math.random() * st.width,
          y: -18,
          vy: 0.036 + Math.random() * 0.034,
          swayPhase: Math.random() * Math.PI * 2,
          swayAmp: 12 + Math.random() * 18,
          size: 7 + Math.random() * 9,
          alpha: 0.35 + Math.random() * 0.45,
          sprite: Math.random() > 0.45 ? st.sprites.gold : st.sprites.rose,
        });
        st.nextRainAt = now + 260;
      }

      st.wishRain = st.wishRain.filter((drop) => drop.y < st.height + 24);
      for (const drop of st.wishRain) {
        drop.y += drop.vy * dt;
        const dx = Math.sin(now * 0.0014 + drop.swayPhase) * drop.swayAmp;
        ctx.globalAlpha = drop.alpha;
        ctx.drawImage(drop.sprite, drop.x + dx - drop.size / 2, drop.y - drop.size / 2, drop.size, drop.size);
      }

      if (st.mode === "cake" && st.candleFlames.length > 0) {
        const flameAppear = Math.min(1, Math.max(0, (elapsed - 650) / 700));
        if (flameAppear > 0) {
          for (const f of st.candleFlames) {
            const flicker = Math.sin(now * 0.012 + f.phase) * 0.16 + Math.cos(now * 0.019 + f.phase) * 0.1;
            const swayX = Math.sin(now * 0.007 + f.phase) * 2.2 + st.tiltX * 8;
            const swayY = st.tiltY * 8;
            const fx = f.x + swayX;
            const fy = f.y + swayY;

            ctx.globalAlpha = flameAppear * (0.55 + flicker * 0.4);
            const haloSize = 48 * (1 + flicker * 0.25);
            ctx.drawImage(st.sprites!.flareGold, fx - haloSize / 2, fy - haloSize / 2, haloSize, haloSize);

            ctx.save();
            ctx.translate(fx, fy + 6);
            ctx.scale(1 - flicker * 0.12, 1 + flicker * 0.22);
            ctx.globalAlpha = flameAppear * 0.95;

            const flameGrad = ctx.createRadialGradient(0, -6, 1, 0, -6, 14);
            flameGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
            flameGrad.addColorStop(0.45, "rgba(255, 224, 130, 0.95)");
            flameGrad.addColorStop(1, "rgba(255, 140, 90, 0)");
            ctx.fillStyle = flameGrad;

            ctx.beginPath();
            ctx.moveTo(0, -18);
            ctx.bezierCurveTo(8, -8, 7, 2, 0, 4);
            ctx.bezierCurveTo(-7, 2, -8, -8, 0, -18);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      if (st.shootingStars.length === 0 && now > st.nextShootAt) {
        const dir = Math.random() > 0.5 ? 1 : -1;
        const speed = 0.52 + Math.random() * 0.32;
        const angle = 0.28 + Math.random() * 0.22;
        st.shootingStars.push({
          x: (0.15 + Math.random() * 0.7) * st.width,
          y: (0.05 + Math.random() * 0.28) * st.height,
          vx: dir * speed * Math.cos(angle),
          vy: speed * Math.sin(angle),
          life: 0,
          duration: 1200 + Math.random() * 500,
          length: 115 + Math.random() * 65,
        });
        st.nextShootAt = now + 3200 + Math.random() * 3600;
      }

      st.shootingStars = st.shootingStars.filter((ssh) => ssh.life + dt < ssh.duration);
      for (const ssh of st.shootingStars) {
        ssh.life += dt;
        ssh.x += ssh.vx * dt;
        ssh.y += ssh.vy * dt;
        const p = ssh.life / ssh.duration;
        const fade = Math.sin(Math.PI * p);
        const spd = Math.hypot(ssh.vx, ssh.vy) || 1;
        const len = ssh.length * Math.min(1, p * 3);
        const tx = ssh.x - (ssh.vx / spd) * len;
        const ty = ssh.y - (ssh.vy / spd) * len;

        const grad = ctx.createLinearGradient(ssh.x, ssh.y, tx, ty);
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * fade})`);
        grad.addColorStop(0.35, `rgba(255, 217, 138, ${0.42 * fade})`);
        grad.addColorStop(1, "rgba(196, 212, 255, 0)");

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ssh.x, ssh.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        ctx.globalAlpha = fade;
        ctx.drawImage(st.sprites!.flareGold, ssh.x - 14, ssh.y - 14, 28, 28);
      }

      for (const sp of st.sparkles) {
        sp.life += dt;
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vx *= 0.972;
        sp.vy *= 0.972;
        ctx.globalAlpha = Math.max(0, 1 - sp.life / sp.duration);
        ctx.drawImage(sp.sprite, sp.x - sp.size / 2, sp.y - sp.size / 2, sp.size, sp.size);
      }
      st.sparkles = st.sparkles.filter((sp) => sp.life < sp.duration);

      for (const rp of st.ripples) {
        rp.life += dt;
        const p = rp.life / rp.duration;
        const r = 10 + p * rp.maxRadius;
        ctx.globalAlpha = Math.max(0, (1 - p) * 0.65);
        ctx.strokeStyle = "rgba(255, 217, 138, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      st.ripples = st.ripples.filter((rp) => rp.life < rp.duration);

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const spawnBurst = (cx: number, cy: number, count = 48) => {
    const st = skyStateRef.current;
    if (!st.sprites) return;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
      const spd = 0.08 + Math.random() * 0.36;
      st.sparkles.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        life: 0,
        duration: 950 + Math.random() * 550,
        size: 10 + Math.random() * 18,
        sprite: i % 2 === 0 ? st.sprites.gold : st.sprites.rose,
      });
    }
    st.ripples.push({ x: cx, y: cy, life: 0, duration: 950, maxRadius: 115 });
  };

  const spawnFireworkShow = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const spots = [
      { x: w * 0.22, y: h * 0.24, delay: 0 },
      { x: w * 0.78, y: h * 0.26, delay: 260 },
      { x: w * 0.5, y: h * 0.18, delay: 520 },
      { x: w * 0.32, y: h * 0.38, delay: 820 },
      { x: w * 0.68, y: h * 0.38, delay: 1080 },
    ];
    spots.forEach((spot) => {
      window.setTimeout(() => {
        spawnBurst(spot.x, spot.y, 54);
      }, spot.delay);
    });
  };

  const launchManualShootingStar = (targetX: number, targetY: number) => {
    const st = skyStateRef.current;
    const dir = targetX > st.width * 0.5 ? -1 : 1;
    const speed = 0.65;
    const angle = 0.34;
    st.shootingStars.push({
      x: targetX,
      y: Math.max(40, targetY - 60),
      vx: dir * speed * Math.cos(angle),
      vy: speed * Math.sin(angle),
      life: 0,
      duration: 1100,
      length: 130,
    });
    spawnBurst(targetX, targetY, 26);
  };

  const spawnTrail = (cx: number, cy: number, count = 3) => {
    const st = skyStateRef.current;
    if (!st.sprites) return;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 0.03 + Math.random() * 0.14;
      st.sparkles.push({
        x: cx + (Math.random() - 0.5) * 14,
        y: cy + (Math.random() - 0.5) * 14,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 0.03,
        life: 0,
        duration: 650 + Math.random() * 450,
        size: 8 + Math.random() * 14,
        sprite: Math.random() > 0.45 ? st.sprites.gold : st.sprites.rose,
      });
    }
  };

  const spawnRipple = (cx: number, cy: number, maxRadius = 76) => {
    skyStateRef.current.ripples.push({ x: cx, y: cy, life: 0, duration: 820, maxRadius });
  };

  const assignPoints = (points: Array<{ x: number; y: number; weight?: number; rose?: boolean }>) => {
    const st = skyStateRef.current;
    if (!st.sprites) return;
    const now = performance.now();
    const base = st.stars.filter((s) => !s.spawned);
    base.forEach((s) => {
      s.inShape = false;
    });

    const shuffled = [...points];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const recruits = [...base]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(base.length, Math.floor(shuffled.length * 0.65)));

    recruits.forEach((star, idx) => {
      const pt = shuffled[idx];
      star.inShape = true;
      star.fromX = (star.x as number) || (star.nx as number) * st.width;
      star.fromY = (star.y as number) || (star.ny as number) * st.height;
      star.toX = pt.x;
      star.toY = pt.y;
      star.weight = pt.weight || 1;
      star.shapeSprite = pt.rose ? st.sprites!.rose : st.sprites!.gold;
      star.delay = Math.random() * 750;
      const dx = (star.toX as number) - (star.fromX as number);
      const dy = (star.toY as number) - (star.fromY as number);
      star.ctrlX = ((star.fromX as number) + (star.toX as number)) / 2 - dy * 0.22;
      star.ctrlY = ((star.fromY as number) + (star.toY as number)) / 2 + dx * 0.22;
    });

    const extra = shuffled.slice(recruits.length).map((pt) => ({
      nx: 0.5,
      ny: 0.45,
      radius: 1.2,
      alpha: 0.9,
      speed: 1.2,
      phase: Math.random() * Math.PI * 2,
      depth: 0.5,
      sprite: st.sprites!.gold,
      flare: false,
      spawned: true,
      inShape: true,
      fromX: st.width * 0.5 + (Math.random() - 0.5) * 30,
      fromY: st.height * 0.45 + (Math.random() - 0.5) * 30,
      toX: pt.x,
      toY: pt.y,
      ctrlX: st.width * 0.5,
      ctrlY: st.height * 0.4,
      weight: pt.weight || 1,
      shapeSprite: pt.rose ? st.sprites!.rose : st.sprites!.gold,
      delay: Math.random() * 850,
      x: 0,
      y: 0,
    }));

    st.stars = [...base, ...extra];
    st.formStart = now;
  };

  const formCake = () => {
    const st = skyStateRef.current;
    st.mode = "cake";
    const cx = st.width * 0.5;
    const cy = st.height * 0.43;
    const scale = Math.min(st.width * 0.48, st.height * 0.29, 215);
    const pts: Array<{ x: number; y: number; weight?: number; rose?: boolean }> = [];

    const addLine = (x1: number, y1: number, x2: number, y2: number, steps: number, weight = 1.0, rose = false) => {
      for (let i = 0; i <= steps; i++) {
        const t = i / Math.max(1, steps);
        pts.push({
          x: cx + (x1 + (x2 - x1) * t) * scale + (Math.random() - 0.5) * 2.2,
          y: cy + (y1 + (y2 - y1) * t) * scale + (Math.random() - 0.5) * 2.2,
          weight,
          rose,
        });
      }
    };

    addLine(-1.02, 0.62, 1.02, 0.62, 28, 1.05, false);
    addLine(-0.84, 0.62, -0.84, 0.16, 15, 1.0, false);
    addLine(0.84, 0.62, 0.84, 0.16, 15, 1.0, false);
    addLine(-0.84, 0.16, 0.84, 0.16, 26, 1.05, false);

    for (let i = 0; i <= 26; i++) {
      const t = i / 26;
      pts.push({
        x: cx + (-0.8 + t * 1.6) * scale,
        y: cy + (0.36 + Math.sin(t * Math.PI * 5) * 0.055) * scale,
        weight: 0.92,
        rose: true,
      });
    }

    addLine(-0.58, 0.16, -0.58, -0.24, 13, 1.0, false);
    addLine(0.58, 0.16, 0.58, -0.24, 13, 1.0, false);
    addLine(-0.58, -0.24, 0.58, -0.24, 22, 1.05, false);

    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push({
        x: cx + (-0.54 + t * 1.08) * scale,
        y: cy + (-0.05 + Math.sin(t * Math.PI * 4) * 0.045) * scale,
        weight: 0.92,
        rose: true,
      });
    }

    st.candleFlames = [];
    [-0.3, 0, 0.3].forEach((kx, idx) => {
      const topY = idx === 1 ? -0.6 : -0.55;
      addLine(kx, -0.24, kx, topY, 10, 1.0, idx === 1);
      st.candleFlames.push({
        x: cx + kx * scale,
        y: cy + (topY - 0.12) * scale,
        phase: idx * 2.1,
      });
    });

    assignPoints(pts);
  };

  const formName = (text: string) => {
    const st = skyStateRef.current;
    st.mode = "name";
    st.candleFlames = [];

    const off = document.createElement("canvas");
    const ctx = off.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const fontSize = Math.min(st.width * 0.22, st.height * 0.19, 144);
    const gap = Math.max(3.0, fontSize / 22);
    off.width = Math.max(1, Math.ceil(st.width));
    off.height = Math.max(1, Math.ceil(fontSize * 1.5));

    ctx.font = `700 ${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, off.width / 2, off.height / 2);

    const img = ctx.getImageData(0, 0, off.width, off.height).data;
    const offsetY = st.height * 0.32 - off.height / 2;
    const pts: Array<{ x: number; y: number; weight?: number; rose?: boolean }> = [];

    for (let gy = gap / 2; gy < off.height; gy += gap) {
      for (let gx = gap / 2; gx < off.width; gx += gap) {
        const px = Math.round(gx);
        const py = Math.round(gy);
        if (img[(py * off.width + px) * 4 + 3] > 128) {
          pts.push({
            x: gx + (Math.random() - 0.5) * gap * 0.4,
            y: gy + offsetY + (Math.random() - 0.5) * gap * 0.4,
            weight: 1.05,
            rose: px / Math.max(1, off.width) > 0.55 && Math.random() > 0.35,
          });
        }
      }
    }

    assignPoints(pts);
  };

  const resetSky = () => {
    const st = skyStateRef.current;
    st.mode = "drift";
    st.candleFlames = [];
    st.wishRainActive = false;
    st.wishRain = [];
    st.stars = st.stars.filter((s) => !s.spawned);
    st.stars.forEach((s) => {
      s.inShape = false;
    });
  };

  const enterDigit = (d: string) => {
    if (busy || stage !== "lock") return;
    unlockAudio();
    birthdayMusic.playKeyTap();
    setFeedback("");
    const next = (digits + d).slice(0, 4);
    setDigits(next);

    if (next.length === 4) {
      if (next === BIRTHDAY_CONFIG.passcode) {
        setBusy(true);
        setSuccessState(true);
        birthdayMusic.playUnlockSuccess();
        spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.45, 72);
        window.setTimeout(() => {
          setStage("intro");
          setBusy(false);
          spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.4, 54);
        }, 460);
      } else {
        setBusy(true);
        setErrorState(true);
        birthdayMusic.playWrongPasscode();
        setFeedback(BIRTHDAY_CONFIG.wrongPasscodeMessage);
        window.setTimeout(() => {
          setDigits("");
          setErrorState(false);
          setBusy(false);
        }, 560);
      }
    }
  };

  const drawNewSegments = (updatedOpened: string[]) => {
    const svg = svgRef.current;
    const fx = fxRef.current;
    if (!svg || !fx) return;

    const ns = "http://www.w3.org/2000/svg";
    const duration = 0.85;

    S_SEGMENTS.forEach((seg, idx) => {
      if (drawnSegmentsRef.current.has(idx)) return;
      if (updatedOpened.includes(seg.fromId) && updatedOpened.includes(seg.toId)) {
        drawnSegmentsRef.current.add(idx);
        birthdayMusic.playConstellationConnect();
        ["constellation-glow", "constellation-line"].forEach((cls) => {
          const path = document.createElementNS(ns, "path");
          path.setAttribute("class", cls);
          path.setAttribute("d", seg.d);
          path.setAttribute("vector-effect", "non-scaling-stroke");
          path.setAttribute("pathLength", "1");
          path.style.strokeDasharray = "1";
          path.style.strokeDashoffset = "1";
          path.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`;
          svg.appendChild(path);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              path.style.strokeDashoffset = "0";
            });
          });
        });

        const spark = document.createElement("span");
        spark.className = "constellation-spark";
        spark.style.left = `${seg.fromX}%`;
        spark.style.top = `${seg.fromY}%`;
        spark.style.transition = `left ${duration}s cubic-bezier(0.65, 0, 0.35, 1), top ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`;
        spark.style.animation = `spark-life ${duration + 0.3}s ease forwards`;
        fx.appendChild(spark);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            spark.style.left = `${seg.toX}%`;
            spark.style.top = `${seg.toY}%`;
          });
        });
        window.setTimeout(() => spark.remove(), 2200);

        const ripple = document.createElement("span");
        ripple.className = "constellation-ripple";
        ripple.style.left = `${seg.toX}%`;
        ripple.style.top = `${seg.toY}%`;
        ripple.style.animation = `ripple-burst 1.1s ${(duration * 0.85).toFixed(2)}s ease-out forwards`;
        fx.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 2200);
      }
    });
  };

  const triggerConstellationCelebrationThenCake = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    setSGlowing(true);
    birthdayMusic.playConstellationConnect();
    MEMORIES.forEach((m, i) => {
      window.setTimeout(() => {
        spawnBurst((m.x / 100) * w, (m.y / 100) * h, 30);
      }, i * 160);
    });
    spawnRipple(w * 0.5, h * 0.42, 150);

    if (constellationCelebrationTimerRef.current) {
      window.clearTimeout(constellationCelebrationTimerRef.current);
    }

    constellationCelebrationTimerRef.current = window.setTimeout(() => {
      setConstellationFading(true);
      window.setTimeout(() => {
        setSGlowing(false);
        startCakeToFinale();
      }, 550);
    }, 1600);
  };

  const startCakeToFinale = () => {
    setCandlesBlown(false);
    skyStateRef.current.wishRainActive = false;
    formCake();
    setStage("cake");
    birthdayMusic.playCakeReveal();

    if (cakeTimerRef.current) window.clearTimeout(cakeTimerRef.current);
    cakeTimerRef.current = window.setTimeout(() => {
      formName("SAMA");
      setStage("finale");
      birthdayMusic.playFinaleChime();
      spawnFireworkShow();
    }, 5200);
  };

  const handleBlowOutCandles = (clientX?: number, clientY?: number) => {
    unlockAudio();
    playCandleBlowSound();
    setCandlesBlown(true);
    skyStateRef.current.wishRainActive = true;
    const cx = clientX ?? window.innerWidth * 0.5;
    const cy = clientY ?? window.innerHeight * 0.56;
    spawnBurst(cx, cy, 68);
    spawnFireworkShow();
  };

  const openMemory = (idx: number) => {
    const mem = MEMORIES[idx];
    unlockAudio();
    birthdayMusic.playMemoryOpen(idx);
    setActiveMemoryIdx(idx);
    setPhotoSrc(mem.src);
  };

  const closeMemory = () => {
    if (activeMemoryIdx === null) return;
    const mem = MEMORIES[activeMemoryIdx];
    setActiveMemoryIdx(null);

    const nextOpened = openedIds.includes(mem.id) ? openedIds : [...openedIds, mem.id];
    setOpenedIds(nextOpened);
    drawNewSegments(nextOpened);

    if (nextOpened.length === MEMORIES.length && stage === "sky") {
      window.setTimeout(() => {
        triggerConstellationCelebrationThenCake();
      }, 950);
    }
  };

  const handleReplay = () => {
    if (cakeTimerRef.current) {
      window.clearTimeout(cakeTimerRef.current);
      cakeTimerRef.current = null;
    }
    if (constellationCelebrationTimerRef.current) {
      window.clearTimeout(constellationCelebrationTimerRef.current);
      constellationCelebrationTimerRef.current = null;
    }
    unlockAudio();
    birthdayMusic.playKeyTap();
    drawnSegmentsRef.current.clear();
    if (svgRef.current) svgRef.current.innerHTML = "";
    if (fxRef.current) fxRef.current.innerHTML = "";
    setConstellationFading(false);
    setSGlowing(false);
    setCandlesBlown(false);
    setOpenedIds([]);
    setActiveMemoryIdx(null);
    setLetterOpen(false);
    resetSky();
    setStage("sky");
  };

  return (
    <div className="app" id="app-root">
      <div className="sky-backdrop" aria-hidden="true" />
      <canvas ref={canvasRef} id="sky-canvas" aria-hidden="true" />

      <section className={`stage-screen ${stage === "lock" ? "" : "is-hidden"}`}>
        <div className="lock-card">
          <h1 className="lock-title">A Special Night Sky ✨</h1>
          <p className="lock-subtitle">Enter your birthday to unlock the sky</p>

          <div className={`lock-dots ${errorState ? "is-error" : ""} ${successState ? "is-success" : ""}`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`lock-dot ${digits.length > i ? "is-filled" : ""}`} />
            ))}
          </div>

          <p className="lock-feedback">{feedback}</p>

          <div className="keypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
              <button key={d} type="button" className="keypad-btn" onClick={() => enterDigit(d)}>
                {d}
              </button>
            ))}
            <span className="keypad-spacer" />
            <button type="button" className="keypad-btn" onClick={() => enterDigit("0")}>
              0
            </button>
            <button
              type="button"
              className="keypad-btn is-back"
              onClick={() => {
                unlockAudio();
                birthdayMusic.playKeyTap();
                setDigits((prev) => prev.slice(0, -1));
              }}
            >
              ⌫
            </button>
          </div>
        </div>
      </section>

      <section
        id="stage-intro"
        className={`stage-screen ${stage === "intro" ? "" : "is-hidden"}`}
        onPointerMove={(e) => {
          if (stage === "intro") spawnTrail(e.clientX, e.clientY, 3);
        }}
        onPointerDown={(e) => {
          if (stage !== "intro") return;
          if ((e.target as HTMLElement).closest(".intro-cta-wrap, .intro-name-wrap")) return;
          birthdayMusic.playStardustTap();
          spawnRipple(e.clientX, e.clientY, 76);
          spawnTrail(e.clientX, e.clientY, 12);
        }}
      >
        <div className="intro-center">
          <div
            className={`intro-name-wrap ${namePulsing ? "is-pulsing" : ""}`}
            onPointerDown={(e) => {
              e.stopPropagation();
              unlockAudio();
              birthdayMusic.playMemoryOpen(2);
              setNamePulsing(true);
              spawnBurst(e.clientX, e.clientY, 38);
              window.setTimeout(() => setNamePulsing(false), 420);
            }}
          >
            <span className="intro-name">{BIRTHDAY_CONFIG.welcomeGreeting}</span>
          </div>
          <span className="intro-line">{BIRTHDAY_CONFIG.welcomeSubtitle}</span>
          <p className="intro-interactive-hint">
            Move your finger or tap anywhere in the sky to scatter stardust ✨
          </p>
        </div>

        <div className="intro-cta-wrap">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              unlockAudio();
              birthdayMusic.playUnlockSuccess();
              setStage("sky");
            }}
          >
            {BIRTHDAY_CONFIG.enterButtonLabel}
          </button>
        </div>
      </section>

      <section id="stage-sky" className={`stage-screen ${stage === "sky" ? "" : "is-hidden"}`}>
        <div
          className={`memory-layer ${activeMemoryIdx !== null ? "is-receded" : ""} ${
            stage !== "sky" || constellationFading ? "is-fading" : ""
          } ${sGlowing ? "is-s-glowing" : ""}`}
        >
          <svg ref={svgRef} className="constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none" />
          <div ref={fxRef} />

          {MEMORIES.map((mem, idx) => {
            const isOpened = openedIds.includes(mem.id);
            return (
              <button
                key={mem.id}
                type="button"
                className={`memory-star ${isOpened ? "is-opened" : ""}`}
                style={{ left: `${mem.x}%`, top: `${mem.y}%`, animationDelay: `${idx * 0.35}s` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (stage === "sky") openMemory(idx);
                }}
              >
                <span className="memory-star-core" />
                <span className="memory-star-badge">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        <div className={`sky-hud ${activeMemoryIdx !== null || stage !== "sky" || constellationFading ? "is-hidden" : ""}`}>
          <p className="sky-hint">
            {openedIds.length === 0
              ? BIRTHDAY_CONFIG.connectInstruction
              : openedIds.length < 4
              ? "Keep going, connect the S ✨"
              : "All stars connected ✨"}
          </p>
          <p className="sky-count">{openedIds.length} / 4</p>
        </div>
      </section>

      <section id="stage-cake" className={`stage-screen ${stage === "cake" ? "" : "is-hidden"}`}>
        <p className="cake-title">{BIRTHDAY_CONFIG.cakeCaption}</p>
      </section>

      <section
        id="stage-finale"
        className={`stage-screen ${stage === "finale" ? "" : "is-hidden"}`}
        onPointerDown={(e) => {
          if (stage !== "finale") return;
          if ((e.target as HTMLElement).closest("button, .finale-cake-wrap")) return;
          birthdayMusic.playStardustTap();
          launchManualShootingStar(e.clientX, e.clientY);
        }}
      >
        <div className="finale-aurora" aria-hidden="true" />

        <div className="finale-content">
          <div
            className={`finale-cake-wrap ${candlesBlown ? "is-blown" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleBlowOutCandles(e.clientX, e.clientY);
            }}
            title="Tap to blow out the candles"
          >
            <div className="finale-candles">
              <span className="finale-candle">
                <span className="finale-flame" />
              </span>
              <span className="finale-candle is-tall">
                <span className="finale-flame" />
              </span>
              <span className="finale-candle">
                <span className="finale-flame" />
              </span>
            </div>
            <div className="finale-cake-top" />
            <div className="finale-cake-base" />
            <div className="finale-cake-plate" />
          </div>

          <p className="finale-title">Happy Birthday</p>
          <div className="finale-actions">
            {!candlesBlown && (
              <button
                type="button"
                className="btn-ghost"
                onClick={(e) => handleBlowOutCandles(e.clientX, e.clientY)}
              >
                Make a Wish 🕯️
              </button>
            )}
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                unlockAudio();
                birthdayMusic.playLetterOpen();
                setLetterOpen(true);
              }}
            >
              {BIRTHDAY_CONFIG.openLetterLabel}
            </button>
            <button type="button" className="btn-ghost" onClick={handleReplay}>
              Replay ✨
            </button>
          </div>
        </div>
      </section>

      <div
        className={`sheet-backdrop ${activeMemoryIdx !== null ? "is-open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMemory();
        }}
      >
        <article className="sheet">
          <div className="sheet-handle">
            <span />
          </div>
          <div className="photo-box">
            <img
              className="photo-media"
              src={photoSrc || undefined}
              alt="Starlight memory"
              onError={() => {
                if (activeMemoryIdx !== null) {
                  setPhotoSrc(generateMemoryArtwork(MEMORIES[activeMemoryIdx].id));
                }
              }}
            />
          </div>
          <div className="sheet-body">
            <span className="memory-eyebrow">
              {activeMemoryIdx !== null ? `Memory ${activeMemoryIdx + 1} of 4` : ""}
            </span>
            <button type="button" className="btn-ghost" onClick={closeMemory}>
              {BIRTHDAY_CONFIG.backToStarsLabel}
            </button>
          </div>
        </article>
      </div>

      <div
        className={`letter-backdrop ${letterOpen ? "is-open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLetterOpen(false);
        }}
      >
        <article className="letter-paper">
          <div className="letter-inner">
            <h2 className="letter-header">{BIRTHDAY_CONFIG.letterTitle} ✨</h2>
            <div className="letter-divider" />
            <p className="letter-arabic-body" dir="rtl" lang="ar">
              {BIRTHDAY_CONFIG.letterBody}
            </p>
            <div className="letter-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  birthdayMusic.playKeyTap();
                  setLetterOpen(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default BirthdayApp;