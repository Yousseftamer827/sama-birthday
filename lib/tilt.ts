type OrientationPermission = () => Promise<"granted" | "denied">;

const MAX_TILT_DEGREES = 25;
const SMOOTHING = 0.08;
const BASELINE_DRIFT = 0.01;

/** Smoothed device tilt in the range -1..1, shared by the canvas and CSS. */
export const tilt = { x: 0, y: 0 };

const target = { x: 0, y: 0 };
let baseline: { beta: number; gamma: number } | null = null;

function clamp(value: number) {
  return Math.max(-1, Math.min(1, value));
}

/** Must be called synchronously inside a user gesture for iOS to prompt. */
export function requestTiltPermission() {
  const requestPermission = (
    globalThis.DeviceOrientationEvent as unknown as {
      requestPermission?: OrientationPermission;
    }
  )?.requestPermission;

  if (typeof requestPermission === "function") {
    requestPermission().catch(() => undefined);
  }
}

function handleOrientation(event: DeviceOrientationEvent) {
  if (event.beta === null || event.gamma === null) return;

  if (!baseline) {
    baseline = { beta: event.beta, gamma: event.gamma };
  }
  // Slowly re-centre so any comfortable holding angle becomes "neutral".
  baseline.beta += (event.beta - baseline.beta) * BASELINE_DRIFT;
  baseline.gamma += (event.gamma - baseline.gamma) * BASELINE_DRIFT;

  target.x = clamp((event.gamma - baseline.gamma) / MAX_TILT_DEGREES);
  target.y = clamp((event.beta - baseline.beta) / MAX_TILT_DEGREES);
}

function handlePointer(event: PointerEvent) {
  if (event.pointerType !== "mouse") return;
  target.x = clamp((event.clientX / window.innerWidth) * 2 - 1);
  target.y = clamp((event.clientY / window.innerHeight) * 2 - 1);
}

export function startTilt() {
  let frame = 0;
  const root = document.documentElement;

  const loop = () => {
    tilt.x += (target.x - tilt.x) * SMOOTHING;
    tilt.y += (target.y - tilt.y) * SMOOTHING;
    root.style.setProperty("--tilt-x", tilt.x.toFixed(3));
    root.style.setProperty("--tilt-y", tilt.y.toFixed(3));
    frame = requestAnimationFrame(loop);
  };

  window.addEventListener("deviceorientation", handleOrientation);
  window.addEventListener("pointermove", handlePointer);
  frame = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("deviceorientation", handleOrientation);
    window.removeEventListener("pointermove", handlePointer);
  };
}
