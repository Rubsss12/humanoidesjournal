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
import { formaterDate, slugifier, tempsDeLecture } from "@/lib/format";
import CarteArticle from "@/components/CarteArticle";
import TitreSection from "@/components/TitreSection";

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
    <article className="pb-12">
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <nav className="font-sans text-[0.66rem] uppercase tracking-[0.16em] text-muted">
          {numero && (
            <>
              <Link
                href={`/numeros/${numero.numero}`}
                className="transition-colors hover:text-accent"
              >
                Édition {numero.numero}
              </Link>
              <span className="mx-2 text-rule">/</span>
            </>
          )}
          <Link
            href={`/rubriques/${slugifier(article.rubrique)}`}
            className="transition-colors hover:text-accent"
          >
            {article.rubrique}
          </Link>
        </nav>
      </div>

      <header className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center">
        <h1 className="font-serif text-4xl font-medium italic leading-[1.05] sm:text-[3.4rem]">
          {article.titre}
        </h1>
        <p className="mx-auto mt-7 max-w-2xl font-serif text-xl italic leading-snug text-ink-soft sm:text-2xl">
          {article.chapo}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-[0.7rem] uppercase tracking-[0.13em] text-muted">
          <span className="font-semibold text-ink">{article.auteur}</span>
          <span aria-hidden>·</span>
          <span>{formaterDate(article.date)}</span>
          <span aria-hidden>·</span>
          <span>{tempsDeLecture(article.contenu)} min de lecture</span>
        </div>
      </header>

      <div className="mx-auto h-px max-w-3xl bg-rule" />

      <div
        className="corps-article mx-auto max-w-[42rem] px-6 pt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mx-auto mt-12 max-w-[42rem] px-6">
        <div className="border-t border-ink pt-6">
          <p className="font-serif text-base italic">— {article.auteur}</p>
          {numero && (
            <p className="mt-2 font-sans text-[0.7rem] uppercase tracking-[0.13em] text-muted">
              Article paru dans{" "}
              <Link
                href={`/numeros/${numero.numero}`}
                className="text-accent transition-colors hover:text-accent-deep hover:underline"
              >
                l’édition {numero.numero} — {numero.titre}
              </Link>
            </p>
          )}
        </div>
      </div>

      {lies.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-6">
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
