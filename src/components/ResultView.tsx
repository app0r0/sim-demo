import type { Simulation } from "@/data/simulations/types";
import { OPEN_CHAT_URL } from "@/config";
import { computeResult, type Answers } from "@/lib/scoring";
import { AxisBarChart } from "./AxisBarChart";

export function ResultView({
  sim,
  answers,
  onReview,
  onRestart,
}: {
  sim: Simulation;
  answers: Answers;
  onReview: () => void;
  onRestart: () => void;
}) {
  const r = computeResult(sim, answers);
  const topLabels = r.topAxes.map((a) => `「${sim.axes[a].label}」`).join("と");

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-ok-soft px-3 py-1 text-xs font-bold text-ok">
          <span aria-hidden>✓</span>
          {sim.questions.length}問のシミュレーションが完了しました
        </p>
        <h1 data-autofocus tabIndex={-1} className="mt-3 text-2xl font-bold outline-none">
          半年間の研究、おつかれさまでした
        </h1>
        <p className="mt-2 text-sm text-ink-muted">今回の回答をもとにした振り返りです。</p>
      </div>

      <section aria-labelledby="knowledge" className="rounded-2xl bg-navy p-5 text-white">
        <h2 id="knowledge" className="text-xs font-bold tracking-wider text-white/80">
          知識チェック
        </h2>
        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-5xl font-bold tabular-nums">{r.knowledgeCorrect}</span>
          <span className="text-lg text-white/80">/ {r.knowledgeTotal}問 正解</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          わからなかった問題は、下の「回答と解説を振り返る」から見直せます。
        </p>
      </section>

      <section aria-labelledby="tendency" className="rounded-2xl border border-line bg-white p-5">
        <h2 id="tendency" className="text-base font-bold">
          判断傾向
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          判断問題{r.axisMax}問で選んだ軸の数です（各軸 0〜{r.axisMax}）。
        </p>
        <div className="mt-4">
          <AxisBarChart sim={sim} scores={r.axisScores} max={r.axisMax} highlight={r.topAxes} />
        </div>
      </section>

      <section aria-labelledby="comment" className="rounded-2xl border border-line bg-white p-5">
        <h2 id="comment" className="text-base font-bold">
          今回表れた出発点
        </h2>
        {r.topAxes.length > 1 && (
          <p className="mt-2 text-sm text-ink-muted">今回は{topLabels}が同じ数で並びました。</p>
        )}
        <div className="mt-3 space-y-3">
          {r.topAxes.map((a) => (
            <div key={a} className="rounded-xl border-l-4 border-accent bg-accent-soft p-4">
              <p className="text-sm font-bold text-accent">
                {sim.axes[a].label}：{sim.axes[a].description}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed">{sim.axes[a].comment}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[15px] font-bold leading-relaxed">{sim.closingNote}</p>
      </section>

      <section className="rounded-2xl border-2 border-accent bg-white p-5 text-center">
        <p className="text-base font-bold">もっと知りたくなったら</p>
        <p className="mt-1 text-sm text-ink-muted">仕事の実際を、現場の声で確かめてみませんか。</p>
        <a
          href={OPEN_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-base font-bold text-white hover:bg-[#1648a6]"
        >
          実際の研究者に話を聞いてみよう
          <span className="sr-only">（新しいタブで開く）</span>
          <span aria-hidden>↗</span>
        </a>
      </section>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={onReview}
          className="min-h-12 w-full rounded-xl border-2 border-accent bg-white px-4 text-sm font-bold text-accent hover:bg-accent-soft"
        >
          {sim.questions.length}問の回答と解説を振り返る
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-bold text-ink hover:bg-surface"
        >
          もう一度やる
        </button>
      </div>
    </div>
  );
}
