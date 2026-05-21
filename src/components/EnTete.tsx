import Link from "next/link";
import { getDernierNumero, getRubriques } from "@/lib/contenu";
import { formaterDate } from "@/lib/format";

export default function EnTete() {
  const dernier = getDernierNumero();
  const rubriques = getRubriques();

  return (
    <header className="border-b-2 border-ink">
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted">
          <span>L’hebdomadaire de la robotique humanoïde</span>
          <span className="hidden sm:block">
            {dernier
              ? `N° ${dernier.numero} — ${formaterDate(dernier.date)}`
              : "Édition inaugurale"}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-7 text-center sm:py-9">
        <Link href="/" className="inline-block">
          <h1 className="font-display text-[2.3rem] font-black leading-none tracking-tight transition-colors hover:text-accent sm:text-6xl">
            Le Journal des Humanoïdes
          </h1>
        </Link>
        <p className="mt-3 font-sans text-[0.62rem] uppercase tracking-[0.3em] text-muted sm:text-[0.68rem]">
          Comprendre les machines qui nous ressemblent
        </p>
      </div>

      <nav className="border-t border-rule">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-5 py-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em]">
          <li>
            <Link href="/" className="transition-colors hover:text-accent">
              La une
            </Link>
          </li>
          {rubriques.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/rubriques/${r.slug}`}
                className="transition-colors hover:text-accent"
              >
                {r.nom}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/numeros"
              className="transition-colors hover:text-accent"
            >
              Numéros
            </Link>
          </li>
          <li>
            <Link
              href="/a-propos"
              className="transition-colors hover:text-accent"
            >
              À propos
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
