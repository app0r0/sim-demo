import type { ChoiceId, Question } from "@/data/simulations/types";
import { isCorrect } from "@/lib/scoring";

/** 回答後の解説パネル（設問画面・振り返り画面で共用） */
export function Feedback({
  question,
  selected,
  autoFocus = false,
}: {
  question: Question;
  selected: ChoiceId;
  autoFocus?: boolean;
}) {
  const ok = isCorrect(question, selected);
  const trap = question.choices.find((c) => c.trap);
  const picked = question.choices.find((c) => c.id === selected)!;
  // 直感の落とし穴で説明済みの選択肢と、選んだ選択肢は「要点」一覧から外す
  const others = question.choices.filter((c) => c.id !== selected && c.id !== trap?.id);
  const correctLabel = question.correct.join(" と ");

  return (
    <section className="space-y-4">
      <div className={`rounded-xl border-l-4 p-4 ${ok ? "border-ok bg-ok-soft" : "border-ng bg-ng-soft"}`}>
        <h3
          tabIndex={autoFocus ? -1 : undefined}
          data-feedback-heading={autoFocus ? "" : undefined}
          className={`text-base font-bold outline-none ${ok ? "text-ok" : "text-ng"}`}
        >
          {ok ? "正解です" : `不正解（正解は ${correctLabel}）`}
        </h3>
        {question.correct.length > 1 && (
          <p className="mt-1 text-sm text-ink">この問題は正解が {correctLabel} の2つです。</p>
        )}
      </div>

      {trap && (
        <div className="rounded-xl border border-warn/40 bg-warn-soft p-4">
          <p className="text-sm font-bold text-warn">
            直感の落とし穴：選択肢 {trap.id}
            {trap.id === selected && "（あなたの回答）"}
          </p>
          <p className="mt-1 text-sm font-bold">{trap.text}</p>
          <p className="mt-2 text-[15px] leading-relaxed">{trap.explanation}</p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-bold text-accent">解説</h4>
        <p className="mt-1 text-[15px] leading-relaxed">{question.commentary}</p>
      </div>

      {picked.id !== trap?.id && (
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="text-sm font-bold">
            あなたの回答：{picked.id}
            {question.correct.includes(picked.id) && (
              <span className="ml-1.5 rounded bg-ok px-1.5 py-0.5 text-[11px] font-bold text-white">正解</span>
            )}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed">{picked.explanation}</p>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-ink-muted">他の選択肢の要点</h4>
          <ul className="mt-2 space-y-2">
            {others.map((c) => (
              <li key={c.id} className="flex gap-3 rounded-xl border border-line bg-white p-3 text-sm leading-relaxed">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface text-xs font-bold">
                  {c.id}
                </span>
                <span>
                  {question.correct.includes(c.id) && (
                    <span className="mr-1.5 rounded bg-ok px-1.5 py-0.5 text-[11px] font-bold text-white">正解</span>
                  )}
                  {c.point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
