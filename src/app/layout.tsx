import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MotZen — Jeu de Mots",
  description: "Un jeu de mots inspiré de Wordscapes et Pro des Mots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-hidden select-none touch-none">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
