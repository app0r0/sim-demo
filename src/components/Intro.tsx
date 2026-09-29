import type { Simulation } from "@/data/simulations/types";

export function Intro({ sim, onStart }: { sim: Simulation; onStart: () => void }) {
  // 「総合」のように他の問題の応用である分類は、科目紹介から外す
  const subjectGroups = sim.categories
    .map((c) => ({
      ...c,
      subjects: sim.questions.filter((q) => q.category === c.id).map((q) => q.subject),
    }))
    .filter((g) => g.subjects.length > 0 && !g.subjects.every((s) => s.startsWith("総合")));

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="p-5 pb-4">
          <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-accent">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {sim.eyebrow}
          </p>
          <h1 className="mt-3 whitespace-pre-line text-[28px] font-bold leading-snug">{sim.headline}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{sim.lead}</p>
        </div>
        <MembraneArt />
      </section>

      <section aria-labelledby="situation" className="rounded-2xl border border-line bg-white p-5">
        <h2 id="situation" className="text-xs font-bold tracking-wider text-accent">
          SITUATION ／ 状況設定
        </h2>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed">
          {sim.situation.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <Stat term="設問" value={`全${sim.questions.length}問`} sub="選択式" />
        <Stat term="所要時間" value={`約${sim.duration}`} sub="スマホで完結" />
        <Stat term="関連科目" value={`${sim.categories.length}分野`} sub="科目別に振り返り" />
      </dl>

      <section aria-labelledby="phases" className="rounded-2xl border border-line bg-white p-5">
        <h2 id="phases" className="text-base font-bold">
          半年間の流れ
        </h2>
        <ol className="mt-3 space-y-2">
          {sim.phases.map((ph) => (
            <li key={ph.id} className="flex items-center gap-3 text-[15px]">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                {ph.id}
              </span>
              フェーズ{ph.id}：{ph.name}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="subjects" className="rounded-2xl border border-line bg-white p-5">
        <h2 id="subjects" className="text-base font-bold">
          この仕事で使う、大学の科目
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          各問には、関連する大学の科目がついています。結果画面では科目別に振り返ります。
        </p>
        <ul className="mt-3 space-y-2">
          {subjectGroups.map((g) => (
            <li key={g.id} className="rounded-xl bg-surface p-3">
              <p className="font-bold">{g.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{g.subjects.join("／")}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-base font-bold text-white shadow-md transition hover:bg-[#1648a6] active:scale-[0.99]"
        >
          シミュレーションを始める
          <span aria-hidden>→</span>
        </button>
        <p className="text-center text-xs text-ink-muted">登録不要・回答は保存されません。</p>
      </div>
    </div>
  );
}

function Stat({ term, value, sub }: { term: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-1 py-3">
      <dt className="text-[11px] text-ink-muted">{term}</dt>
      <dd className="mt-1 text-[15px] font-bold">{value}</dd>
      <dd className="mt-0.5 text-[10px] text-ink-muted">{sub}</dd>
    </div>
  );
}

/** 抽象的な「膜と水」のイメージ図（装飾） */
function MembraneArt() {
  const drops = [30, 70, 120, 165, 210, 250, 290];
  const salts = [50, 100, 145, 190, 235, 275];
  return (
    <svg viewBox="0 0 320 120" className="block w-full bg-accent-soft" aria-hidden>
      <defs>
        <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="#c9d8f0" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="320" height="120" fill="url(#grid)" />
      {salts.map((x, i) => (
        <circle key={x} cx={x} cy={22 + (i % 2) * 14} r="4.5" fill="#8fa3c0" />
      ))}
      {drops.map((x, i) => (
        <circle key={x} cx={x} cy={30 + (i % 3) * 8} r="3" fill="#1a56c4" />
      ))}
      <path
        d="M0 62 Q10 54 20 62 T40 62 T60 62 T80 62 T100 62 T120 62 T140 62 T160 62 T180 62 T200 62 T220 62 T240 62 T260 62 T280 62 T300 62 T320 62 V70 H0 Z"
        fill="#0b2545"
      />
      <rect y="70" width="320" height="14" fill="#16345e" opacity="0.55" />
      {drops.map((x, i) => (
        <circle key={`b${x}`} cx={x + 8} cy={96 + (i % 2) * 10} r="3" fill="#1a56c4" opacity="0.85" />
      ))}
    </svg>
  );
}
