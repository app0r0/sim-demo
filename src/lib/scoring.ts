import { AXES, type Axis, type ChoiceId, type Simulation } from "@/data/simulations/types";

export type Answers = Record<string, ChoiceId>;

export type SimResult = {
  knowledgeCorrect: number;
  knowledgeTotal: number;
  axisScores: Record<Axis, number>;
  /** 判断問題の数（= 各軸の最大値） */
  axisMax: number;
  /** 最高点の軸（同点はすべて。AXES の順） */
  topAxes: Axis[];
};

export function computeResult(sim: Simulation, answers: Answers): SimResult {
  let knowledgeCorrect = 0;
  let knowledgeTotal = 0;
  let axisMax = 0;
  const axisScores: Record<Axis, number> = { explore: 0, verify: 0, business: 0, collab: 0 };

  for (const q of sim.questions) {
    const picked = answers[q.id];
    if (q.type === "knowledge") {
      knowledgeTotal++;
      if (picked === q.correct) knowledgeCorrect++;
    } else {
      axisMax++;
      const choice = q.choices.find((c) => c.id === picked);
      if (choice) axisScores[choice.axis]++;
    }
  }

  const top = Math.max(...AXES.map((a) => axisScores[a]));
  const topAxes = top > 0 ? AXES.filter((a) => axisScores[a] === top) : [];

  return { knowledgeCorrect, knowledgeTotal, axisScores, axisMax, topAxes };
}
