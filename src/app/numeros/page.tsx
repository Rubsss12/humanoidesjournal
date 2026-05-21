import Link from "next/link";
import type { Metadata } from "next";
import { getTousLesNumeros, getArticlesDuNumero } from "@/lib/contenu";
import { formaterDate } from "@/lib/format";
import EtiquetteRubrique from "@/components/EtiquetteRubrique";

export const metadata: Metadata = {
  title: "Tous les numéros",
  description:
    "L’ensemble des numéros hebdomadaires du Journal des Humanoïdes.",
};

export default function Page() {
  const numeros = getTousLesNumeros();

  return (
    <div className="mx-auto max-w-6xl px-5">
      <header className="border-b-2 border-ink py-10">
        <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.22em] text-accent">
          Archives
        </p>
        <h1 className="mt-2 font-display text-5xl font-black sm:text-6xl">
          Tous les numéros
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Chaque semaine, un nouveau numéro du Journal des Humanoïdes.
        </p>
      </header>

      <div className="divide-y divide-rule">
        {numeros.map((n) => {
          const articles = getArticlesDuNumero(n.numero);
          return (
            <section key={n.numero} className="py-10">
              <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
                <div>
                  <span className="font-display text-6xl font-black leading-none text-accent">
                    N° {n.numero}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-bold leading-tight">
                    <Link
                      href={`/numeros/${n.numero}`}
                      className="transition-colors hover:text-accent"
                    >
                      {n.titre}
                    </Link>
                  </h2>
                  {n.sousTitre && (
                    <p className="mt-1 italic text-ink-soft">{n.sousTitre}</p>
                  )}
                  <p className="mt-3 font-sans text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    {formaterDate(n.date)} · {articles.length} article
                    {articles.length > 1 ? "s" : ""}
                  </p>
                  <Link
                    href={`/numeros/${n.numero}`}
                    className="mt-4 inline-block font-sans text-[0.72rem] font-bold uppercase tracking-[0.13em] text-accent transition-colors hover:text-accent-deep"
                  >
                    Ouvrir le numéro →
                  </Link>
                </div>
                <ul className="space-y-3">
                  {articles.map((a) => (
                    <li key={a.slug} className="border-t border-rule pt-3">
                      <EtiquetteRubrique rubrique={a.rubrique} />
                      <h3 className="mt-1 font-display text-lg font-bold leading-snug">
                        <Link
                          href={`/articles/${a.slug}`}
                          className="transition-colors hover:text-accent"
                        >
                          {a.titre}
                        </Link>
                      </h3>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
