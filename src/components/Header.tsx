import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-lavender-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-mauve text-sm font-black text-white transition-colors group-hover:bg-mauve-deep">
            A
          </span>
          <span className="text-[1.05rem] font-extrabold uppercase tracking-[0.08em]">
            Agenti<span className="text-mauve">pedia</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="kicker text-ink-soft transition-colors hover:text-mauve">
            Index
          </Link>
          <Link href="/methodology" className="kicker text-ink-soft transition-colors hover:text-mauve">
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}
