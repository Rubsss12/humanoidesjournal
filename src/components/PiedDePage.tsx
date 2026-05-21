import Link from "next/link";
import Embleme from "./Embleme";
import { getRubriques, getTousLesNumeros } from "@/lib/contenu";

export default function PiedDePage() {
  const rubriques = getRubriques();
  const numeros = getTousLesNumeros().slice(0, 4);

  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Embleme className="h-10 w-10 text-accent" />
            <span className="font-display text-lg font-bold leading-[1.1]">
              Le Journal
              <br />
              des Humanoïdes
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            L’hebdomadaire qui décrypte l’essor des robots humanoïdes — sans
            emballement ni catastrophisme.
          </p>
        </div>

        <nav>
          <h2 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
            Rubriques
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
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
          </ul>
        </nav>

        <nav>
          <h2 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
            Numéros
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {numeros.map((n) => (
              <li key={n.numero}>
                <Link
                  href={`/numeros/${n.numero}`}
                  className="transition-colors hover:text-accent"
                >
                  N° {n.numero} — {n.titre}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/numeros"
                className="font-semibold text-accent transition-colors hover:text-accent-deep"
              >
                Tous les numéros →
              </Link>
            </li>
          </ul>
        </nav>

        <nav>
          <h2 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">
            Le journal
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-accent">
                La une
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
      </div>

      <div className="border-t border-rule">
        <p className="mx-auto max-w-6xl px-5 py-5 font-sans text-[0.66rem] uppercase tracking-[0.1em] text-muted">
          © 2026 Le Journal des Humanoïdes — maquette de démonstration, articles
          illustratifs.
        </p>
      </div>
    </footer>
  );
}
