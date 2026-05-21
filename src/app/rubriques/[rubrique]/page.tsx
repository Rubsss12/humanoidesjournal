import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getRubriques,
  getArticlesParRubrique,
  getNomRubrique,
} from "@/lib/contenu";
import CarteArticle from "@/components/CarteArticle";

type Props = { params: Promise<{ rubrique: string }> };

export function generateStaticParams() {
  return getRubriques().map((r) => ({ rubrique: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rubrique } = await params;
  const nom = getNomRubrique(rubrique);
  if (!nom) return {};
  return {
    title: `Rubrique ${nom}`,
    description: `Tous les articles de la rubrique ${nom}.`,
  };
}

export default async function Page({ params }: Props) {
  const { rubrique } = await params;
  const nom = getNomRubrique(rubrique);
  if (!nom) notFound();

  const articles = getArticlesParRubrique(rubrique);

  return (
    <div className="mx-auto max-w-6xl px-5">
      <header className="border-b-2 border-ink py-10">
        <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.22em] text-accent">
          Rubrique
        </p>
        <h1 className="mt-2 font-display text-5xl font-black sm:text-6xl">
          {nom}
        </h1>
        <p className="mt-3 font-sans text-[0.78rem] uppercase tracking-[0.12em] text-muted">
          {articles.length} article{articles.length > 1 ? "s" : ""}
        </p>
      </header>

      <div className="pb-6">
        {articles.map((a) => (
          <CarteArticle key={a.slug} article={a} variante="liste" />
        ))}
      </div>
    </div>
  );
}
