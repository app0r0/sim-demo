import type { CategoryScore } from "@/lib/scoring";

/** 科目別スコアの横棒グラフ（SVG自作）。トラックの長さ＝その科目の問題数 */
export function SubjectBarChart({ scores }: { scores: CategoryScore[] }) {
  // 375px幅の端末でほぼ等倍になる幅
  const W = 300;
  const labelW = 124;
  const valueW = 44;
  const plotX = labelW;
  const plotW = W - labelW - valueW - 8;
  const rowH = 38;
  const barH = 16;
  const top = 4;
  const maxTotal = Math.max(1, ...scores.map((s) => s.total));
  const H = top + rowH * scores.length + 4;
  const len = (v: number) => (plotW * v) / maxTotal;

  const summary = scores.map((s) => `${s.label} ${s.total}問中${s.correct}問正解`).join("、");

  // 右端だけ角丸にしたバー（左端は基線に接する）
  const bar = (x0: number, y0: number, w: number) => {
    const r = Math.min(4, w);
    return `M${x0} ${y0} H${x0 + w - r} Q${x0 + w} ${y0} ${x0 + w} ${y0 + r} V${y0 + barH - r} Q${x0 + w} ${y0 + barH} ${x0 + w - r} ${y0 + barH} H${x0} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`科目別スコア：${summary}`}>
      {scores.map((s, row) => {
        const cy = top + rowH * row + rowH / 2;
        const y0 = cy - barH / 2;
        return (
          <g key={s.id}>
            <text x={0} y={cy + 5} fontSize="14" fontWeight={600} fill="#13233a">
              {s.label}
            </text>
            {/* トラック（問題数ぶん） */}
            <path d={bar(plotX, y0, len(s.total))} fill="#e3e9f1" />
            {s.correct > 0 && <path d={bar(plotX, y0, len(s.correct))} fill="#1a56c4" />}
            {/* 1問ごとの区切り */}
            {Array.from({ length: s.total - 1 }, (_, i) => (
              <line
                key={i}
                x1={plotX + len(i + 1)}
                x2={plotX + len(i + 1)}
                y1={y0}
                y2={y0 + barH}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
            <line x1={plotX} x2={plotX} y1={y0 - 3} y2={y0 + barH + 3} stroke="#8a99ad" strokeWidth={1.2} />
            <text
              x={W}
              y={cy + 5}
              textAnchor="end"
              fontSize="14"
              fontWeight={700}
              fill="#13233a"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {s.correct}
              <tspan fontSize="11" fontWeight={500} fill="#4a5a70">
                {" "}/ {s.total}
              </tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
