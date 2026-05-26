import type { Metadata } from "next";
import { Newsreader, Archivo } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://le-journal-des-humanoides.example"),
  title: {
    default:
      "Le Journal des Humanoïdes — l’hebdomadaire de la robotique humanoïde",
    template: "%s — Le Journal des Humanoïdes",
  },
  description:
    "L’hebdomadaire qui décrypte l’essor des robots humanoïdes : industrie, technologie, société. Sans emballement ni catastrophisme.",
  openGraph: {
    title: "Le Journal des Humanoïdes",
    description: "L’hebdomadaire qui décrypte l’essor des robots humanoïdes.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${newsreader.variable} ${archivo.variable}`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
