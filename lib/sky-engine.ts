export interface SkyPoint {
  x: number;
  y: number;
}

// إحداثيات النجوم الأربعة المرسومة على شكل حرف "S" (بنسب مئوية 0 إلى 1)
export const S_CONSTELLATION_POINTS: SkyPoint[] = [
  { x: 0.63, y: 0.24 }, // نجمة 1 (أعلى يمين حرف S)
  { x: 0.37, y: 0.38 }, // نجمة 2 (انحناء يسار علوي)
  { x: 0.62, y: 0.56 }, // نجمة 3 (انحناء يمين سفلي)
  { x: 0.36, y: 0.72 }, // نجمة 4 (أسفل يسار حرف S)
];

// نقاط لتشكيل تورتة عيد الميلاد و3 شموع مضيئة
export function getCakeFormationPoints(width: number, height: number): SkyPoint[] {
  const cx = width * 0.5;
  const cy = height * 0.54;
  const points: SkyPoint[] = [];

  // قاعدة التورتة والطبقة العلوية
  const w = Math.min(width * 0.34, 240);
  const h = Math.min(height * 0.16, 110);

  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    points.push({ x: cx - w / 2 + t * w, y: cy + h / 2 });
    points.push({ x: cx - w / 2 + t * w, y: cy - h / 2 });
  }
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    points.push({ x: cx - w / 2, y: cy - h / 2 + t * h });
    points.push({ x: cx + w / 2, y: cy - h / 2 + t * h });
  }

  // 3 شموع أعلى التورتة
  const candleOffsets = [-w * 0.25, 0, w * 0.25];
  candleOffsets.forEach((offset) => {
    const baseX = cx + offset;
    const topY = cy - h / 2 - 28;
    points.push({ x: baseX, y: cy - h / 2 });
    points.push({ x: baseX, y: topY + 10 });
    points.push({ x: baseX, y: topY }); // لهب الشمعة
  });

  return points;
}

// نقاط لتشكيل كلمة "SAMA" في السماء
export function getNameFormationPoints(width: number, height: number): SkyPoint[] {
  const cx = width * 0.5;
  const cy = height * 0.48;
  const scale = Math.min(width / 780, 1);
  const letterW = 72 * scale;
  const letterH = 110 * scale;
  const gap = 28 * scale;
  const totalW = letterW * 4 + gap * 3;
  const startX = cx - totalW / 2;
  const topY = cy - letterH / 2;
  const botY = cy + letterH / 2;
  const midY = cy;

  const pts: SkyPoint[] = [];

  const addLine = (x1: number, y1: number, x2: number, y2: number, steps = 8) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
    }
  };

  // حرف S
  const sX = startX;
  addLine(sX + letterW, topY, sX, topY, 6);
  addLine(sX, topY, sX, midY, 6);
  addLine(sX, midY, sX + letterW, midY, 6);
  addLine(sX + letterW, midY, sX + letterW, botY, 6);
  addLine(sX + letterW, botY, sX, botY, 6);

  // حرف A الأول
  const a1X = startX + letterW + gap;
  addLine(a1X, botY, a1X + letterW / 2, topY, 8);
  addLine(a1X + letterW / 2, topY, a1X + letterW, botY, 8);
  addLine(a1X + letterW * 0.22, midY + letterH * 0.1, a1X + letterW * 0.78, midY + letterH * 0.1, 5);

  // حرف M
  const mX = startX + (letterW + gap) * 2;
  addLine(mX, botY, mX, topY, 8);
  addLine(mX, topY, mX + letterW / 2, midY, 6);
  addLine(mX + letterW / 2, midY, mX + letterW, topY, 6);
  addLine(mX + letterW, topY, mX + letterW, botY, 8);

  // حرف A الثاني
  const a2X = startX + (letterW + gap) * 3;
  addLine(a2X, botY, a2X + letterW / 2, topY, 8);
  addLine(a2X + letterW / 2, topY, a2X + letterW, botY, 8);
  addLine(a2X + letterW * 0.22, midY + letterH * 0.1, a2X + letterW * 0.78, midY + letterH * 0.1, 5);

  return pts;
}