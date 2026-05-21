import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";
import {
  getNumero,
  getTousLesNumeros,
  getArticlesDuNumero,
} from "@/lib/contenu";
import { formaterDate } from "@/lib/format";
import CarteArticle from "@/components/CarteArticle";
import EtiquetteRubrique from "@/components/EtiquetteRubrique";

type Props = { params: Promise<{ numero: string }> };

export function generateStaticParams() {
  return getTousLesNumeros().map((n) => ({ numero: String(n.numero) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { numero } = await params;
  const n = getNumero(Number(numero));
  if (!n) return {};
  return {
    title: `Numéro ${n.numero} — ${n.titre}`,
    description: n.chapo || n.sousTitre,
  };
}

export default async function Page({ params }: Props) {
  const { numero } = await params;
  const n = getNumero(Number(numero));
  if (!n) notFound();

  const articles = getArticlesDuNumero(n.numero);
  const une = articles[0];
  const reste = articles.slice(1);
  const editoHtml = await marked.parse(n.edito);

  return (
    <div className="mx-auto max-w-6xl px-5">
      <header className="border-b-2 border-ink py-10 text-center">
        <p className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.22em] text-accent">
          Numéro {n.numero} · {formaterDate(n.date)}
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-black leading-[1.05] sm:text-5xl">
          {n.titre}
        </h1>
        {n.sousTitre && (
          <p className="mt-3 font-display text-xl italic text-ink-soft">
            {n.sousTitre}
          </p>
        )}
      </header>

      <div className="grid gap-10 py-10 lg:grid-cols-3">
        <article className="lg:border-r lg:border-rule lg:pr-8">
          <h2 className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.2em] text-accent">
            L’éditorial
          </h2>
          <div
            className="prose-edito mt-3"
            dangerouslySetInnerHTML={{ __html: editoHtml }}
          />
        </article>

        <div className="lg:col-span-2">
          {une && (
            <article className="group border-b border-rule pb-8">
              <EtiquetteRubrique rubrique={une.rubrique} />
              <h2 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">
                <Link
                  href={`/articles/${une.slug}`}
                  className="transition-colors group-hover:text-accent"
                >
                  {une.titre}
                </Link>
              </h2>
              <p className="mt-3 font-display text-lg italic text-ink-soft">
                {une.chapo}
              </p>
              <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                Par {une.auteur}
              </p>
            </article>
          )}
          {reste.length > 0 && (
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {reste.map((a) => (
                <CarteArticle key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-rule py-8">
        <Link
          href="/numeros"
          className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.13em] text-accent transition-colors hover:text-accent-deep"
        >
          ← Tous les numéros
        </Link>
      </div>
    </div>
  );
}
