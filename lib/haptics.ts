function buzz(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export const haptics = {
  tap: () => buzz(12),
  open: () => buzz([8, 30, 14]),
  wrong: () => buzz([70, 50, 70]),
  unlock: () => buzz([20, 60, 20, 60, 120]),
  heartbeat: () => buzz([50, 110, 50, 500, 50, 110, 50]),
};
