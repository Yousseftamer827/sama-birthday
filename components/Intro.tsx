"use client";

export function Intro({
  name,
  onBegin,
}: {
  name: string;
  onBegin: () => void;
}) {
  return (
    <button className="screen intro" type="button" onClick={onBegin}>
      <span className="intro-name">{name},</span>
      <span className="intro-line">happy birthday.</span>
      <span className="intro-hint">Tap anywhere</span>
    </button>
  );
}
