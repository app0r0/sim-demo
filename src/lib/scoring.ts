import type { ChoiceId, Question, Simulation } from "@/data/simulations/types";

export type Answers = Record<string, ChoiceId>;

export type CategoryScore = { id: string; label: string; correct: number; total: number };

export type SimResult = {
  correct: number;
  total: number;
  categories: CategoryScore[];
  correctQuestions: Question[];
  missedQuestions: Question[];
};

export const isCorrect = (q: Question, picked: ChoiceId | undefined) =>
  picked !== undefined && q.correct.includes(picked);

export function computeResult(sim: Simulation, answers: Answers): SimResult {
  const correctQuestions = sim.questions.filter((q) => isCorrect(q, answers[q.id]));
  const missedQuestions = sim.questions.filter((q) => !isCorrect(q, answers[q.id]));

  const categories = sim.categories.map((c) => {
    const qs = sim.questions.filter((q) => q.category === c.id);
    return {
      id: c.id,
      label: c.label,
      total: qs.length,
      correct: qs.filter((q) => isCorrect(q, answers[q.id])).length,
    };
  });

  return {
    correct: correctQuestions.length,
    total: sim.questions.length,
    categories,
    correctQuestions,
    missedQuestions,
  };
}
