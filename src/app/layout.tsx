import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://agentipedia.example"),
  title: {
    default: "Agentipedia — the living encyclopedia of AI agents at work",
    template: "%s — Agentipedia",
  },
  description:
    "A self-updating catalog of real, verified AI agent deployments inside named companies, worldwide. Every entry names the company and the exact solution, with sources.",
  openGraph: {
    title: "Agentipedia",
    description: "Real companies. Named AI agents. Verified sources. Worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
