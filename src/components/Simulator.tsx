"use client";

import { useEffect, useRef, useState } from "react";
import type { ChoiceId, Simulation } from "@/data/simulations/types";
import type { Answers } from "@/lib/scoring";
import { SiteFooter, SiteHeader } from "./Chrome";
import { Intro } from "./Intro";
import { QuestionView } from "./QuestionView";
import { ResultView } from "./ResultView";
import { ReviewView } from "./ReviewView";

type Screen = { kind: "intro" } | { kind: "question"; index: number } | { kind: "result" } | { kind: "review" };

export function Simulator({ sim }: { sim: Simulation }) {
  const [screen, setScreen] = useState<Screen>({ kind: "intro" });
  const [answers, setAnswers] = useState<Answers>({});
  const mainRef = useRef<HTMLElement>(null);

  // 画面が切り替わったら先頭へ戻し、見出しにフォーカスを移す
  const screenKey = screen.kind === "question" ? `q${screen.index}` : screen.kind;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  }, [screenKey]);

  const answer = (questionId: string, choice: ChoiceId) => {
    setAnswers((prev) => (prev[questionId] ? prev : { ...prev, [questionId]: choice }));
  };

  const restart = () => {
    setAnswers({});
    setScreen({ kind: "intro" });
  };

  const step = screen.kind === "intro" ? 0 : screen.kind === "question" ? 1 : 2;

  return (
    <>
      <SiteHeader step={step} />
      <main ref={mainRef} className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {screen.kind === "intro" && (
          <Intro sim={sim} onStart={() => setScreen({ kind: "question", index: 0 })} />
        )}
        {screen.kind === "question" && (
          <QuestionView
            key={screen.index}
            sim={sim}
            index={screen.index}
            selected={answers[sim.questions[screen.index].id]}
            onAnswer={answer}
            onNext={() =>
              setScreen(
                screen.index + 1 < sim.questions.length
                  ? { kind: "question", index: screen.index + 1 }
                  : { kind: "result" },
              )
            }
          />
        )}
        {screen.kind === "result" && (
          <ResultView
            sim={sim}
            answers={answers}
            onReview={() => setScreen({ kind: "review" })}
            onRestart={restart}
          />
        )}
        {screen.kind === "review" && (
          <ReviewView sim={sim} answers={answers} onBack={() => setScreen({ kind: "result" })} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
