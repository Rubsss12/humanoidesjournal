import Link from "next/link";
import Embleme from "@/components/Embleme";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <Embleme className="h-20 w-20 text-accent" />
      <p className="mt-6 font-sans text-[0.72rem] font-bold uppercase tracking-[0.22em] text-accent">
        Erreur 404
      </p>
      <h1 className="mt-2 font-display text-4xl font-black sm:text-5xl">
        Page introuvable
      </h1>
      <p className="mt-3 text-ink-soft">
        Cette page n’existe pas — ou n’a pas encore été imprimée.
      </p>
      <Link
        href="/"
        className="mt-7 border-2 border-ink px-6 py-2.5 font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
      >
        Retour à la une
      </Link>
    </div>
  );
}
