import type { Question, Simulation } from "@/data/simulations/types";
import { OPEN_CHAT_URL } from "@/config";
import { computeResult, type Answers } from "@/lib/scoring";
import { SubjectBarChart } from "./SubjectBarChart";

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
  const qNo = (q: Question) => sim.questions.indexOf(q) + 1;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-ok-soft px-3 py-1 text-xs font-bold text-ok">
          <span aria-hidden>✓</span>
          {r.total}問のシミュレーションが完了しました
        </p>
        <h1 data-autofocus tabIndex={-1} className="mt-3 text-2xl font-bold outline-none">
          半年間の研究、おつかれさまでした
        </h1>
      </div>

      <section aria-labelledby="total" className="rounded-2xl bg-navy p-5 text-white">
        <h2 id="total" className="text-xs font-bold tracking-wider text-white/80">
          総合スコア
        </h2>
        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-5xl font-bold tabular-nums">{r.correct}</span>
          <span className="text-lg text-white/80">/ {r.total}問 正解</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/90">
          {r.correct > 0
            ? `${r.total}つの場面のうち${r.correct}つで、あなたの大学の知識が使われました。`
            : "この仕事では、大学で学ぶさまざまな科目が使われます。下の一覧で、どの場面で使われるのかを見てみましょう。"}
        </p>
      </section>

      <section aria-labelledby="by-subject" className="rounded-2xl border border-line bg-white p-5">
        <h2 id="by-subject" className="text-base font-bold">
          科目別スコア
        </h2>
        <p className="mt-1 text-xs text-ink-muted">棒の長さはその科目の問題数、濃い部分が正解数です。</p>
        <div className="mt-3">
          <SubjectBarChart scores={r.categories} />
        </div>
      </section>

      {r.correctQuestions.length > 0 && (
        <SceneList
          id="used"
          heading="あなたの知識が使われた場面"
          questions={r.correctQuestions}
          qNo={qNo}
          tone="ok"
        />
      )}

      {r.missedQuestions.length > 0 && (
        <SceneList
          id="subjects"
          heading="この仕事では、大学のこの科目が使われます"
          questions={r.missedQuestions}
          qNo={qNo}
          tone="accent"
        />
      )}

      <section aria-labelledby="related" className="rounded-2xl border border-line bg-white p-5">
        <h2 id="related" className="text-base font-bold">
          {sim.related.heading}
        </h2>
        <ul className="mt-3 space-y-2">
          {sim.related.items.map((it) => (
            <li key={it.name} className="rounded-xl bg-surface p-3 text-sm leading-relaxed">
              <span className="font-bold">{it.name}</span>：{it.text}
            </li>
          ))}
        </ul>
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
          {r.total}問の回答と解説を振り返る
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

function SceneList({
  id,
  heading,
  questions,
  qNo,
  tone,
}: {
  id: string;
  heading: string;
  questions: Question[];
  qNo: (q: Question) => number;
  tone: "ok" | "accent";
}) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-line bg-white p-5">
      <h2 id={id} className="text-base font-bold">
        {heading}
      </h2>
      <ul className="mt-3 space-y-2">
        {questions.map((q) => (
          <li
            key={q.id}
            className={`rounded-xl border-l-4 p-3 ${tone === "ok" ? "border-ok bg-ok-soft" : "border-accent bg-accent-soft"}`}
          >
            <p className={`text-sm font-bold ${tone === "ok" ? "text-ok" : "text-accent"}`}>
              Q{qNo(q)}　{q.subject}
            </p>
            <p className="mt-0.5 text-sm leading-relaxed">{q.scene}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
