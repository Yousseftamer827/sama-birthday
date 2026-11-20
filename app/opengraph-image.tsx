import { ImageResponse } from "next/og";

export const alt = "Happy Birthday";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STARS = Array.from({ length: 90 }, (_, index) => ({
  left: (index * 137.5) % 1200,
  top: (index * 71.3) % 630,
  size: (index % 3) + 1,
  opacity: 0.25 + ((index * 37) % 70) / 100,
}));

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background:
          "radial-gradient(90% 70% at 50% 110%, #3a1f55 0%, #0b1026 55%, #05060f 100%)",
        color: "#ffd98a",
        fontFamily: "serif",
      }}
    >
      {STARS.map((star, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: star.size,
            background: "#dee6ff",
            opacity: star.opacity,
          }}
        />
      ))}
      <div style={{ fontSize: 108, letterSpacing: 4 }}>Happy Birthday</div>
      <div
        style={{
          marginTop: 18,
          fontSize: 44,
          fontStyle: "italic",
          color: "#ffa7bd",
        }}
      >
        Yousef
      </div>
    </div>,
    size,
  );
}
