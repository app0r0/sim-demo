import { AXES, type Axis, type Simulation } from "@/data/simulations/types";

/** 4軸の横棒グラフ（SVG自作） */
export function AxisBarChart({
  sim,
  scores,
  max,
  highlight,
}: {
  sim: Simulation;
  scores: Record<Axis, number>;
  max: number;
  highlight: Axis[];
}) {
  // 375px幅の端末でほぼ等倍になる幅
  const W = 300;
  const labelW = 110;
  const valueW = 40;
  const plotX = labelW;
  const plotW = W - labelW - valueW;
  const rowH = 46;
  const barH = 18;
  const top = 6;
  const axisY = top + rowH * AXES.length;
  const H = axisY + 22;
  const x = (v: number) => plotX + (plotW * v) / Math.max(max, 1);

  const summary = AXES.map((a) => `${sim.axes[a].label} ${scores[a]}点`).join("、");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`判断傾向（各${max}点満点）：${summary}`}>
      {/* 目盛り線 */}
      {Array.from({ length: max + 1 }, (_, i) => (
        <g key={i}>
          <line
            x1={x(i)}
            x2={x(i)}
            y1={top}
            y2={axisY}
            stroke={i === 0 ? "#8a99ad" : "#e3e9f1"}
            strokeWidth={i === 0 ? 1.2 : 1}
          />
          <text x={x(i)} y={axisY + 15} textAnchor="middle" fontSize="11" fill="#4a5a70">
            {i}
          </text>
        </g>
      ))}

      {AXES.map((a, row) => {
        const cy = top + rowH * row + rowH / 2;
        const v = scores[a];
        const w = x(v) - plotX;
        const r = Math.min(4, w);
        const y0 = cy - barH / 2;
        const isTop = highlight.includes(a);
        return (
          <g key={a}>
            <text x={0} y={cy - 4} fontSize="14" fontWeight={isTop ? 700 : 500} fill="#13233a">
              {sim.axes[a].label}
            </text>
            <text x={0} y={cy + 14} fontSize="11" fill="#4a5a70">
              {sim.axes[a].description}
            </text>
            {v > 0 && (
              <path
                d={`M${plotX} ${y0} H${plotX + w - r} Q${plotX + w} ${y0} ${plotX + w} ${y0 + r} V${y0 + barH - r} Q${plotX + w} ${y0 + barH} ${plotX + w - r} ${y0 + barH} H${plotX} Z`}
                fill={isTop ? "#1a56c4" : "#6d93d6"}
              />
            )}
            <text
              x={W}
              y={cy + 5}
              textAnchor="end"
              fontSize="14"
              fontWeight={700}
              fill="#13233a"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {v}
              <tspan fontSize="11" fontWeight={500} fill="#4a5a70">
                {" "}/ {max}
              </tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
