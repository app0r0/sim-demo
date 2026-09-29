import { DISCLAIMER, ORG_NAME } from "@/config";

const STEPS = ["状況を知る", "体験する", "振り返る"] as const;

/** step: 0=イントロ, 1=設問, 2=結果（省略時はステップ表示なし） */
export function SiteHeader({ step }: { step?: 0 | 1 | 2 }) {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 pt-4 pb-3">
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-lg border border-white/30 bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0C6 10.4 8.5 7.2 12 3z" />
          </svg>
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide">{ORG_NAME}</p>
          <p className="text-[11px] tracking-[0.2em] text-white/75">CAREER SIMULATION</p>
        </div>
      </div>
      {step !== undefined && (
        <ol className="mx-auto flex max-w-xl gap-1 px-4 pb-3" aria-label="進行状況">
          {STEPS.map((label, i) => {
            const active = i === step;
            return (
              <li
                key={label}
                aria-current={active ? "step" : undefined}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-bold ${
                  active ? "bg-white/15 text-white" : "text-white/70"
                }`}
              >
                <span
                  className={`grid size-5 place-items-center rounded-full text-[10px] ${
                    active ? "bg-accent text-white" : "border border-white/40"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {label}
              </li>
            );
          })}
        </ol>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <p className="mx-auto max-w-xl px-4 py-5 text-xs leading-relaxed text-ink-muted">{DISCLAIMER}</p>
    </footer>
  );
}
