import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Archivo } from "next/font/google";
import "./globals.css";
import EnTete from "@/components/EnTete";
import PiedDePage from "@/components/PiedDePage";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
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
    description:
      "L’hebdomadaire qui décrypte l’essor des robots humanoïdes.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${sourceSerif.variable} ${archivo.variable}`}
    >
      <body className="flex min-h-screen flex-col font-serif antialiased">
        <EnTete />
        <main className="flex-1">{children}</main>
        <PiedDePage />
      </body>
    </html>
  );
}
