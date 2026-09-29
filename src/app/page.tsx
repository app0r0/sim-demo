import Link from "next/link";
import { simulations } from "@/data/simulations";
import { SiteFooter, SiteHeader } from "@/components/Chrome";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <h1 className="text-xl font-bold">お仕事シミュレーション一覧</h1>
        <ul className="mt-4 space-y-3">
          {simulations.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/sim/${s.slug}`}
                className="flex min-h-11 items-center rounded-xl border border-line bg-white px-4 py-3 font-bold text-accent hover:bg-accent-soft"
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
