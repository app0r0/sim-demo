import type { Simulation } from "@/data/simulations/types";
import type { Answers } from "@/lib/scoring";
import { Feedback } from "./Feedback";

export function ReviewView({ sim, answers, onBack }: { sim: Simulation; answers: Answers; onBack: () => void }) {
  const backButton = (
    <button
      type="button"
      onClick={onBack}
      className="min-h-12 w-full rounded-xl border-2 border-accent bg-white px-4 text-sm font-bold text-accent hover:bg-accent-soft"
    >
      ← 結果に戻る
    </button>
  );

  return (
    <div className="space-y-5">
      <h1 data-autofocus tabIndex={-1} className="text-2xl font-bold outline-none">
        回答と解説の振り返り
      </h1>
      {backButton}
      {sim.questions.map((q, i) => {
        const selected = answers[q.id];
        const phase = sim.phases.find((p) => p.id === q.phase);
        const picked = q.choices.find((c) => c.id === selected);
        return (
          <article key={q.id} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-xs font-bold text-accent">
              QUESTION {String(i + 1).padStart(2, "0")}・フェーズ{q.phase} {phase?.name}
            </p>
            <h2 className="mt-2 text-base font-bold leading-relaxed">{q.prompt}</h2>
            {picked && selected ? (
              <>
                <p className="mt-2 text-sm text-ink-muted">
                  あなたの回答：{selected}. {picked.text}
                </p>
                <div className="mt-4">
                  <Feedback sim={sim} question={q} selected={selected} />
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">未回答</p>
            )}
          </article>
        );
      })}
      {backButton}
    </div>
  );
}
