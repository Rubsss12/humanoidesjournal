import type { Metadata } from "next";
import Embleme from "@/components/Embleme";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "La ligne éditoriale et la méthode du Journal des Humanoïdes.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-5">
      <header className="py-12 text-center">
        <Embleme className="mx-auto h-16 w-16 text-accent" />
        <h1 className="mt-5 font-display text-4xl font-black sm:text-5xl">
          À propos du journal
        </h1>
        <p className="mt-3 font-display text-xl italic text-ink-soft">
          Comprendre les machines qui nous ressemblent.
        </p>
      </header>

      <div className="corps-article">
        <p>
          Le Journal des Humanoïdes est un hebdomadaire indépendant consacré à
          une seule question, vaste et concrète : que se passe-t-il lorsque des
          machines à notre image quittent les laboratoires pour entrer dans les
          usines, les entrepôts et, un jour peut-être, les foyers ?
        </p>
        <p>
          Chaque semaine, un nouveau numéro fait le point — un éditorial, un
          article de tête, des décryptages et des analyses.
        </p>

        <h2>Notre ligne</h2>
        <p>
          La robotique humanoïde attire à la fois les promesses démesurées et
          les peurs irraisonnées. Nous refusons les deux. Notre travail consiste
          à <strong>expliquer, vérifier et mettre en perspective</strong> :
          distinguer la démonstration spectaculaire du produit fiable, le
          prototype de la machine déployée, l’annonce de la réalité
          industrielle.
        </p>
        <p>Ni techno-béatitude, ni catastrophisme : de la lucidité.</p>

        <h2>Comment nous travaillons</h2>
        <p>
          Le journal est rédigé selon un modèle hybride,{" "}
          <strong>manuel et assisté par l’intelligence artificielle</strong>.
          Les angles, la hiérarchie de l’information et la validation finale
          relèvent de la rédaction humaine. L’IA intervient comme un outil
          d’appui : recherche, synthèse de sources, premières versions de textes
          que les rédacteurs reprennent, corrigent et signent.
        </p>
        <p>
          Chaque article est écrit en Markdown, accompagné de ses métadonnées
          (titre, rubrique, numéro, auteur). Ce format simple permet de publier
          chaque semaine, vite, sans sacrifier la rigueur.
        </p>

        <h2>Nos rubriques</h2>
        <ul>
          <li>
            <strong>Décryptage</strong> — comprendre les grandes questions de
            fond.
          </li>
          <li>
            <strong>Industrie</strong> — entreprises, usines, déploiements et
            géographie du secteur.
          </li>
          <li>
            <strong>Technologie</strong> — matériel, logiciel, intelligence
            artificielle.
          </li>
          <li>
            <strong>Société</strong> — emploi, sécurité, éthique, vie
            quotidienne.
          </li>
          <li>
            <strong>Tribune</strong> — opinions et points de vue argumentés.
          </li>
        </ul>
      </div>

      <p className="mb-4 mt-10 border-t border-rule pt-5 text-sm leading-relaxed text-muted">
        Note — ce site est une maquette de démonstration. Les articles publiés
        sont des textes illustratifs : ils s’appuient sur des connaissances
        générales du secteur et ne rapportent ni information exclusive, ni
        déclaration attribuée à des personnes réelles.
      </p>
    </div>
  );
}
