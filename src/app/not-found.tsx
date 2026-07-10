import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
      <p className="kicker text-mauve">404</p>
      <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">
        This page is not in the catalog
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        The address may be wrong, or the entry was removed after a correction.
        Everything that is verified lives in the index.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-mauve px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mauve-deep"
      >
        Back to the index
      </Link>
    </main>
  );
}
