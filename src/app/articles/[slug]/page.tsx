import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";
import {
  getArticle,
  getTousLesArticles,
  getArticlesLies,
  getNumero,
} from "@/lib/contenu";
import { formaterDate, tempsDeLecture } from "@/lib/format";
import EtiquetteRubrique from "@/components/EtiquetteRubrique";
import CarteArticle from "@/components/CarteArticle";
import TitreSection from "@/components/TitreSection";
import Embleme from "@/components/Embleme";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getTousLesArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.titre,
    description: a.chapo,
    openGraph: { title: a.titre, description: a.chapo, type: "article" },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const html = await marked.parse(article.contenu);
  const numero = getNumero(article.numero);
  const lies = getArticlesLies(article, 3);

  return (
    <article className="px-5">
      <header className="mx-auto max-w-3xl pt-10 text-center">
        <EtiquetteRubrique rubrique={article.rubrique} className="text-[0.74rem]" />
        <h1 className="mt-3 font-display text-4xl font-black leading-[1.08] sm:text-5xl">
          {article.titre}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl font-display text-xl italic leading-snug text-ink-soft sm:text-2xl">
          {article.chapo}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-[0.7rem] uppercase tracking-[0.11em] text-muted">
          <span className="font-bold text-ink">{article.auteur}</span>
          <span aria-hidden>·</span>
          <span>{formaterDate(article.date)}</span>
          <span aria-hidden>·</span>
          <span>{tempsDeLecture(article.contenu)} min de lecture</span>
          {numero && (
            <>
              <span aria-hidden>·</span>
              <Link
                href={`/numeros/${numero.numero}`}
                className="text-accent hover:underline"
              >
                Numéro {numero.numero}
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="mx-auto my-9 h-px max-w-3xl bg-ink" />

      <div
        className="corps-article mx-auto max-w-2xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mx-auto mt-14 max-w-2xl border-t-2 border-ink pt-6">
        <div className="flex items-start gap-4">
          <Embleme className="h-10 w-10 shrink-0 text-accent" />
          <p className="text-sm leading-relaxed text-ink-soft">
            <span className="font-bold text-ink">{article.auteur}</span> — Le
            Journal des Humanoïdes.
            {numero && (
              <>
                {" "}
                Article paru dans le{" "}
                <Link
                  href={`/numeros/${numero.numero}`}
                  className="text-accent underline underline-offset-2"
                >
                  Numéro {numero.numero} — {numero.titre}
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>

      {lies.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl">
          <TitreSection>À lire aussi</TitreSection>
          <div className="mt-7 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {lies.map((a) => (
              <CarteArticle key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
