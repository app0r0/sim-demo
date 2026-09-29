import type { ChoiceId, Question, Simulation } from "@/data/simulations/types";

/** 回答後の解説パネル（設問画面・振り返り画面で共用） */
export function Feedback({
  sim,
  question,
  selected,
  autoFocus = false,
}: {
  sim: Simulation;
  question: Question;
  selected: ChoiceId;
  autoFocus?: boolean;
}) {
  const picked = question.choices.find((c) => c.id === selected)!;
  const others = question.choices.filter((c) => c.id !== selected);

  let tone: "ok" | "ng" | "warn" | "neutral" = "neutral";
  let heading: string;
  if (question.type === "knowledge") {
    const partial = question.choices.find((c) => c.id === selected)?.partial;
    if (selected === question.correct) {
      tone = "ok";
      heading = "正解です";
    } else {
      tone = partial ? "warn" : "ng";
      heading = `${partial ? "部分的に妥当" : "不正解"}（正解は ${question.correct}）`;
    }
  } else {
    const axis = question.choices.find((c) => c.id === selected)!.axis;
    heading = `あなたの選択：${selected}（${sim.axes[axis].label}）`;
  }

  const toneClass = {
    ok: "border-ok bg-ok-soft text-ok",
    ng: "border-ng bg-ng-soft text-ng",
    warn: "border-warn bg-warn-soft text-warn",
    neutral: "border-accent bg-accent-soft text-accent",
  }[tone];

  return (
    <section className="space-y-4">
      <div className={`rounded-xl border-l-4 p-4 ${toneClass}`}>
        <h3
          tabIndex={autoFocus ? -1 : undefined}
          data-feedback-heading={autoFocus ? "" : undefined}
          className="text-sm font-bold outline-none"
        >
          {heading}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{picked.explanation}</p>
      </div>

      {question.note && (
        <p className="rounded-xl bg-surface p-4 text-sm leading-relaxed">
          <span className="font-bold">ポイント：</span>
          {question.note}
        </p>
      )}

      <div>
        <h4 className="text-sm font-bold text-ink-muted">他の選択肢の要点</h4>
        <ul className="mt-2 space-y-2">
          {others.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-xl border border-line bg-white p-3 text-sm leading-relaxed">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface text-xs font-bold">
                {c.id}
              </span>
              <span>
                {question.type === "knowledge" && c.id === question.correct && (
                  <span className="mr-1.5 rounded bg-ok px-1.5 py-0.5 text-[11px] font-bold text-white">正解</span>
                )}
                {question.type === "knowledge" && "partial" in c && c.partial && (
                  <span className="mr-1.5 rounded bg-warn px-1.5 py-0.5 text-[11px] font-bold text-white">
                    部分的に妥当
                  </span>
                )}
                {question.type === "judgment" && "axis" in c && (
                  <span className="mr-1.5 rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-bold text-accent">
                    {sim.axes[c.axis].label}
                  </span>
                )}
                {c.point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
