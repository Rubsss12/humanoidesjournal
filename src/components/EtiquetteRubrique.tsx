import Link from "next/link";
import { slugifier } from "@/lib/format";

export default function EtiquetteRubrique({
  rubrique,
  className = "",
}: {
  rubrique: string;
  className?: string;
}) {
  return (
    <Link
      href={`/rubriques/${slugifier(rubrique)}`}
      className={`inline-block font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-deep ${className}`}
    >
      {rubrique}
    </Link>
  );
}
