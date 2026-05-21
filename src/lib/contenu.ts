import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugifier } from "./format";

const RACINE = path.join(process.cwd(), "content");
const DOSSIER_ARTICLES = path.join(RACINE, "articles");
const DOSSIER_NUMEROS = path.join(RACINE, "numeros");

export interface Article {
  slug: string;
  titre: string;
  numero: number;
  date: string;
  auteur: string;
  rubrique: string;
  chapo: string;
  aLaUne: boolean;
  rang: number;
  contenu: string;
}

export interface Numero {
  numero: number;
  titre: string;
  sousTitre: string;
  chapo: string;
  date: string;
  edito: string;
}

export interface Rubrique {
  nom: string;
  slug: string;
  nombre: number;
}

let cacheArticles: Article[] | null = null;
let cacheNumeros: Numero[] | null = null;

function lireDossier(dossier: string): { nom: string; brut: string }[] {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith(".md"))
    .map((nom) => ({ nom, brut: fs.readFileSync(path.join(dossier, nom), "utf8") }));
}

function lireArticles(): Article[] {
  if (cacheArticles) return cacheArticles;
  cacheArticles = lireDossier(DOSSIER_ARTICLES).map(({ nom, brut }) => {
    const { data, content } = matter(brut);
    return {
      slug: nom.replace(/\.md$/, ""),
      titre: String(data.titre ?? "Sans titre"),
      numero: Number(data.numero ?? 0),
      date: String(data.date ?? ""),
      auteur: String(data.auteur ?? "La rédaction"),
      rubrique: String(data.rubrique ?? "Décryptage"),
      chapo: String(data.chapo ?? ""),
      aLaUne: Boolean(data.aLaUne),
      rang: Number(data.rang ?? 99),
      contenu: content.trim(),
    };
  });
  return cacheArticles;
}

function lireNumeros(): Numero[] {
  if (cacheNumeros) return cacheNumeros;
  cacheNumeros = lireDossier(DOSSIER_NUMEROS).map(({ brut }) => {
    const { data, content } = matter(brut);
    return {
      numero: Number(data.numero ?? 0),
      titre: String(data.titre ?? ""),
      sousTitre: String(data.sousTitre ?? ""),
      chapo: String(data.chapo ?? ""),
      date: String(data.date ?? ""),
      edito: content.trim(),
    };
  });
  return cacheNumeros;
}

export function getTousLesArticles(): Article[] {
  return [...lireArticles()].sort(
    (a, b) => b.numero - a.numero || a.rang - b.rang,
  );
}

export function getArticle(slug: string): Article | undefined {
  return lireArticles().find((a) => a.slug === slug);
}

export function getArticlesDuNumero(numero: number): Article[] {
  return lireArticles()
    .filter((a) => a.numero === numero)
    .sort((a, b) => a.rang - b.rang);
}

export function getTousLesNumeros(): Numero[] {
  return [...lireNumeros()].sort((a, b) => b.numero - a.numero);
}

export function getNumero(numero: number): Numero | undefined {
  return lireNumeros().find((n) => n.numero === numero);
}

export function getDernierNumero(): Numero | undefined {
  return getTousLesNumeros()[0];
}

export function getRubriques(): Rubrique[] {
  const compte = new Map<string, number>();
  for (const a of lireArticles()) {
    compte.set(a.rubrique, (compte.get(a.rubrique) ?? 0) + 1);
  }
  return [...compte.entries()]
    .map(([nom, nombre]) => ({ nom, slug: slugifier(nom), nombre }))
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}

export function getNomRubrique(slugRubrique: string): string | undefined {
  return getRubriques().find((r) => r.slug === slugRubrique)?.nom;
}

export function getArticlesParRubrique(slugRubrique: string): Article[] {
  return getTousLesArticles().filter(
    (a) => slugifier(a.rubrique) === slugRubrique,
  );
}

export function getArticlesLies(article: Article, limite = 3): Article[] {
  const autres = getTousLesArticles().filter((a) => a.slug !== article.slug);
  const memeRubrique = autres.filter((a) => a.rubrique === article.rubrique);
  const reste = autres.filter((a) => a.rubrique !== article.rubrique);
  return [...memeRubrique, ...reste].slice(0, limite);
}
