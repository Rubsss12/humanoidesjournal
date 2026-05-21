import Link from "next/link";
import type { Article } from "@/lib/contenu";
import { formaterDate } from "@/lib/format";
import EtiquetteRubrique from "./EtiquetteRubrique";

type Variante = "standard" | "compacte" | "liste";

export default function CarteArticle({
  article,
  variante = "standard",
}: {
  article: Article;
  variante?: Variante;
}) {
  const lien = `/articles/${article.slug}`;

  if (variante === "compacte") {
    return (
      <article className="group border-t border-rule pt-4">
        <EtiquetteRubrique rubrique={article.rubrique} />
        <h3 className="mt-2 font-display text-lg font-bold leading-snug">
          <Link href={lien} className="transition-colors group-hover:text-accent">
            {article.titre}
          </Link>
        </h3>
        <p className="mt-2 font-sans text-[0.68rem] uppercase tracking-[0.1em] text-muted">
          {article.auteur}
        </p>
      </article>
    );
  }

  if (variante === "liste") {
    return (
      <article className="group grid gap-x-8 gap-y-3 border-t border-rule py-7 sm:grid-cols-[1fr_9rem]">
        <div>
          <EtiquetteRubrique rubrique={article.rubrique} />
          <h3 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-[1.7rem]">
            <Link
              href={lien}
              className="transition-colors group-hover:text-accent"
            >
              {article.titre}
            </Link>
          </h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
            {article.chapo}
          </p>
        </div>
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.1em] text-muted sm:text-right">
          <span className="block font-semibold text-ink">{article.auteur}</span>
          {formaterDate(article.date)}
        </p>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      <EtiquetteRubrique rubrique={article.rubrique} />
      <h3 className="mt-2 font-display text-2xl font-bold leading-[1.15]">
        <Link href={lien} className="transition-colors group-hover:text-accent">
          {article.titre}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-4 flex-1 leading-relaxed text-ink-soft">
        {article.chapo}
      </p>
      <p className="mt-4 font-sans text-[0.68rem] uppercase tracking-[0.1em] text-muted">
        {article.auteur} · {formaterDate(article.date)}
      </p>
    </article>
  );
}
