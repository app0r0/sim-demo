"use client";

import { useEffect, useRef } from "react";
import type { ChoiceId, Simulation } from "@/data/simulations/types";
import { Feedback } from "./Feedback";

export function QuestionView({
  sim,
  index,
  selected,
  onAnswer,
  onNext,
}: {
  sim: Simulation;
  index: number;
  selected: ChoiceId | undefined;
  onAnswer: (questionId: string, choice: ChoiceId) => void;
  onNext: () => void;
}) {
  const q = sim.questions[index];
  const total = sim.questions.length;
  const phase = sim.phases.find((p) => p.id === q.phase);
  const answered = selected !== undefined;
  const isLast = index + 1 === total;
  const feedbackRef = useRef<HTMLDivElement>(null);

  // 回答したら解説の見出しへフォーカスを移す（スクリーンリーダー・キーボード向け）
  useEffect(() => {
    if (!answered) return;
    const el = feedbackRef.current?.querySelector<HTMLElement>("[data-feedback-heading]");
    el?.focus({ preventScroll: true });
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [answered]);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-bold">
            <span className="text-accent">フェーズ{q.phase}</span>
            <span className="ml-2">{phase?.name}</span>
          </p>
          <p className="text-sm font-bold tabular-nums" aria-hidden>
            {index + 1} / {total}
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="進み具合"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-valuetext={`${total}問中${index + 1}問目`}
          className="mt-2 h-2 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-accent">
            QUESTION {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
              q.type === "knowledge" ? "bg-ok-soft text-ok" : "bg-accent-soft text-accent"
            }`}
          >
            {q.type === "knowledge" ? "知識チェック" : "判断（正解なし）"}
          </span>
        </div>
        <h2 data-autofocus tabIndex={-1} className="mt-3 text-lg font-bold leading-relaxed outline-none">
          {q.prompt}
        </h2>
        <p className="mt-2 text-xs text-ink-muted">
          {q.type === "knowledge"
            ? "最も適切だと思うものを、1つ選んでください。"
            : "正解はありません。あなたならどうするか、1つ選んでください。"}
        </p>

        <ul className="mt-4 space-y-2.5">
          {q.choices.map((c) => {
            const isSelected = selected === c.id;
            const isCorrect = q.type === "knowledge" && c.id === q.correct;
            let state = "border-line bg-white hover:border-accent hover:bg-accent-soft";
            let badge: string | null = null;
            if (answered) {
              if (q.type === "knowledge" && isCorrect) {
                state = "border-ok bg-ok-soft";
                badge = "正解";
              } else if (isSelected && q.type === "knowledge") {
                state = "border-ng bg-ng-soft";
                badge = "あなたの回答";
              } else if (isSelected) {
                state = "border-accent bg-accent-soft";
                badge = "あなたの選択";
              } else {
                state = "border-line bg-white text-ink-muted";
              }
            }
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-disabled={answered}
                  aria-pressed={isSelected}
                  onClick={() => !answered && onAnswer(q.id, c.id)}
                  className={`flex min-h-14 w-full items-start gap-3 rounded-xl border-2 p-3 text-left text-[15px] leading-relaxed transition ${state} ${
                    answered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-md text-sm font-bold ${
                      isSelected ? "bg-ink text-white" : "bg-surface text-ink"
                    }`}
                  >
                    {c.id}
                  </span>
                  <span className="flex-1 pt-0.5">
                    {c.text}
                    {badge && (
                      <span
                        className={`ml-2 inline-block rounded px-1.5 py-0.5 align-middle text-[11px] font-bold text-white ${
                          badge === "正解" ? "bg-ok" : badge === "あなたの回答" ? "bg-ng" : "bg-accent"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div ref={feedbackRef} className="mt-6 scroll-mt-4 border-t border-line pt-5">
            <Feedback sim={sim} question={q} selected={selected} autoFocus />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-xs text-ink-muted">
            {answered ? "解説を読んだら、次へ進みましょう。" : "選択すると解説が表示されます。"}
          </p>
          <button
            type="button"
            onClick={onNext}
            disabled={!answered}
            className="flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-white transition hover:bg-[#1648a6] disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
          >
            {isLast ? "結果を見る" : "次へ"}
            <span aria-hidden>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
