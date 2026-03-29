const WAVE_BARS = [
  { id: "w1", h: 0.3 },
  { id: "w2", h: 0.7 },
  { id: "w3", h: 1 },
  { id: "w4", h: 0.6 },
  { id: "w5", h: 0.4 },
  { id: "w6", h: 0.9 },
  { id: "w7", h: 0.5 },
  { id: "w8", h: 0.8 },
  { id: "w9", h: 0.35 },
  { id: "w10", h: 0.65 },
  { id: "w11", h: 0.95 },
  { id: "w12", h: 0.45 },
  { id: "w13", h: 0.75 },
  { id: "w14", h: 0.55 },
  { id: "w15", h: 0.85 },
];

export const MINI_BARS = [
  { id: "m1", h: 0.4 },
  { id: "m2", h: 0.8 },
  { id: "m3", h: 1 },
  { id: "m4", h: 0.6 },
];

export function WaveformBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-8">
      {WAVE_BARS.map(({ id, h }, i) => (
        <span
          key={id}
          className="waveform-bar"
          style={{
            height: `${h * 28}px`,
            animationDelay: `${i * 0.07}s`,
            animationPlayState: playing ? "running" : "paused",
            opacity: playing ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}
