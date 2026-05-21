import type { MetadataRoute } from "next";
import {
  getTousLesArticles,
  getTousLesNumeros,
  getRubriques,
} from "@/lib/contenu";

const BASE = "https://le-journal-des-humanoides.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const statiques: MetadataRoute.Sitemap = ["", "/numeros", "/a-propos"].map(
    (chemin) => ({ url: `${BASE}${chemin}`, lastModified: new Date() }),
  );

  const numeros: MetadataRoute.Sitemap = getTousLesNumeros().map((n) => ({
    url: `${BASE}/numeros/${n.numero}`,
    lastModified: new Date(n.date),
  }));

  const articles: MetadataRoute.Sitemap = getTousLesArticles().map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.date),
  }));

  const rubriques: MetadataRoute.Sitemap = getRubriques().map((r) => ({
    url: `${BASE}/rubriques/${r.slug}`,
    lastModified: new Date(),
  }));

  return [...statiques, ...numeros, ...articles, ...rubriques];
}
