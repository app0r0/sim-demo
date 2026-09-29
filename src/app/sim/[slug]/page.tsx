import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSimulation, simulations } from "@/data/simulations";
import { Simulator } from "@/components/Simulator";
import { ORG_NAME } from "@/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return simulations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sim/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const sim = getSimulation(slug);
  return { title: sim ? `${sim.title} | ${ORG_NAME}` : ORG_NAME };
}

export default async function SimPage({ params }: PageProps<"/sim/[slug]">) {
  const { slug } = await params;
  const sim = getSimulation(slug);
  if (!sim) notFound();
  return <Simulator sim={sim} />;
}
