import { torayRd } from "./toray-rd";
import type { Simulation } from "./types";

// 企業を追加するときは、ファイルを作ってここに1行足すだけで /sim/<slug> が増えます。
export const simulations: Simulation[] = [torayRd];

export function getSimulation(slug: string): Simulation | undefined {
  return simulations.find((s) => s.slug === slug);
}
