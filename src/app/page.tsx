import Link from "next/link";
import {
  getDernierNumero,
  getArticlesDuNumero,
  getTousLesNumeros,
  getRubriques,
} from "@/lib/contenu";
import { formaterDate } from "@/lib/format";
import Embleme from "@/components/Embleme";
import CarteArticle from "@/components/CarteArticle";
import EtiquetteRubrique from "@/components/EtiquetteRubrique";
import TitreSection from "@/components/TitreSection";

export default function Page() {
  const numero = getDernierNumero();

  if (!numero) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-display text-3xl font-bold">Aucun numéro publié</h2>
        <p className="mt-3 text-ink-soft">
          Le premier numéro est en préparation.
        </p>
      </div>
    );
  }

  const articles = getArticlesDuNumero(numero.numero);
  const une = articles[0];
  const secondaires = articles.slice(1, 3);
  const reste = articles.slice(3);
  const precedents = getTousLesNumeros().filter(
    (n) => n.numero !== numero.numero,
  );
  const rubriques = getRubriques();
  const teaserEdito = numero.chapo || numero.sousTitre;

  return (
    <div>
      <div className="border-b border-rule bg-paper-deep">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center font-sans text-[0.68rem] uppercase tracking-[0.13em]">
          <span className="font-bold">Numéro {numero.numero}</span>
          <span aria-hidden className="text-rule">
            /
          </span>
          <span className="text-muted">{numero.titre}</span>
          <span aria-hidden className="text-rule">
            /
          </span>
          <span className="text-muted">{formaterDate(numero.date)}</span>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {une && (
            <article className="lg:col-span-2 lg:border-r lg:border-rule lg:pr-10">
              <div className="flex items-center gap-3">
                <span className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">
                  À la une
                </span>
                <span className="h-px flex-1 bg-rule" />
              </div>
              <EtiquetteRubrique rubrique={une.rubrique} className="mt-6" />
              <h2 className="mt-3 font-display text-4xl font-black leading-[1.04] sm:text-[3.4rem]">
                <Link
                  href={`/articles/${une.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {une.titre}
                </Link>
              </h2>
              <div className="mt-6 grid items-start gap-6 sm:grid-cols-[1.5fr_1fr]">
                <div>
                  <p className="font-display text-xl italic leading-snug text-ink-soft sm:text-2xl">
                    {une.chapo}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-sans text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                      Par {une.auteur}
                    </span>
                    <Link
                      href={`/articles/${une.slug}`}
                      className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.13em] text-accent transition-colors hover:text-accent-deep"
                    >
                      Lire l’article →
                    </Link>
                  </div>
                </div>
                <div className="texture-points flex aspect-square items-center justify-center border border-rule">
                  <Embleme className="h-28 w-28 text-accent" />
                </div>
              </div>
            </article>
          )}

          <aside className="space-y-8">
            <div className="border-2 border-ink bg-paper-deep p-6">
              <h2 className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">
                L’éditorial
              </h2>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
                {numero.titre}
              </h3>
              {teaserEdito && (
                <p className="mt-3 leading-relaxed text-ink-soft">
                  {teaserEdito}
                </p>
              )}
              <Link
                href={`/numeros/${numero.numero}`}
                className="mt-4 inline-block font-sans text-[0.72rem] font-bold uppercase tracking-[0.13em] text-accent transition-colors hover:text-accent-deep"
              >
                Lire l’éditorial →
              </Link>
            </div>
            {secondaires.map((a) => (
              <CarteArticle key={a.slug} article={a} variante="compacte" />
            ))}
          </aside>
        </div>
      </section>

      {reste.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-14">
          <TitreSection>Aussi dans ce numéro</TitreSection>
          <div className="mt-7 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {reste.map((a) => (
              <CarteArticle key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-rule bg-paper-deep">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <TitreSection>Explorer les rubriques</TitreSection>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {rubriques.map((r) => (
              <Link
                key={r.slug}
                href={`/rubriques/${r.slug}`}
                className="group flex min-h-28 flex-col justify-between border border-rule bg-paper p-4 transition-colors hover:border-ink"
              >
                <span className="font-display text-xl font-bold leading-tight transition-colors group-hover:text-accent">
                  {r.nom}
                </span>
                <span className="mt-3 font-sans text-[0.64rem] uppercase tracking-[0.12em] text-muted">
                  {r.nombre} article{r.nombre > 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {precedents.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-14">
          <TitreSection>Dans les numéros précédents</TitreSection>
          <div className="mt-3">
            {precedents.map((n) => (
              <Link
                key={n.numero}
                href={`/numeros/${n.numero}`}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-rule py-5"
              >
                <span className="font-display text-2xl font-black text-accent">
                  N° {n.numero}
                </span>
                <span className="font-display text-xl font-bold transition-colors group-hover:text-accent">
                  {n.titre}
                </span>
                <span className="ml-auto font-sans text-[0.68rem] uppercase tracking-[0.1em] text-muted">
                  {formaterDate(n.date)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
