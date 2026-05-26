import Link from "next/link";
import { getDernierNumero, getArticlesDuNumero } from "@/lib/contenu";
import { formaterDate } from "@/lib/format";

export default function Page() {
  const numero = getDernierNumero();

  if (!numero) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl italic">Aucun numéro publié</h1>
      </div>
    );
  }

  const articles = getArticlesDuNumero(numero.numero);
  const une = articles[0];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ink/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">
          <span>Édition hebdomadaire</span>
          <span>
            N° {numero.numero} · {formaterDate(numero.date)}
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl text-center">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.24em] text-ink-soft">
            Numéro {numero.numero} · {formaterDate(numero.date)}
          </p>

          <h1 className="mt-10 font-serif font-medium leading-[0.94] text-[3.2rem] sm:text-[5rem] md:text-[6.5rem]">
            Le Journal
            <br />
            des <em className="italic font-medium text-accent">Humanoïdes</em>
          </h1>

          <p className="mt-10 font-serif text-xl italic text-ink-soft sm:text-2xl">
            Comprendre les machines qui nous ressemblent
          </p>

          <div className="mt-16 border-t border-ink/20 pt-8">
            <p className="font-sans text-[0.66rem] uppercase tracking-[0.2em] text-ink-soft">
              Dans ce numéro
            </p>
            <h2 className="mt-3 font-serif text-2xl italic leading-snug sm:text-3xl">
              « {numero.titre} »
            </h2>
            {une && (
              <p className="mx-auto mt-5 max-w-lg font-serif text-base leading-relaxed text-ink-soft">
                <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.22em] text-accent">
                  À la une
                </span>
                <br />
                {une.titre} —{" "}
                <span className="italic">par {une.auteur}</span>
              </p>
            )}
          </div>

          <div className="mt-12">
            <Link
              href={`/numeros/${numero.numero}`}
              className="inline-block border-2 border-ink bg-ink px-8 py-3.5 font-sans text-[0.7rem] font-bold uppercase tracking-[0.22em] text-cream transition-colors hover:border-accent hover:bg-accent"
            >
              Lire l’édition →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-ink/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">
          <span>© 2026 Le Journal des Humanoïdes</span>
          <div className="flex gap-5">
            <Link href="/numeros" className="hover:text-accent">
              Archives
            </Link>
            <Link href="/a-propos" className="hover:text-accent">
              À propos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
