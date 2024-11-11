import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./data/contexts/AuthContext";
import TransactionProvider from "./data/contexts/TransactionContext";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finans Flow",
  description: "Gerencie suas receitas e despesas de um jeito descomplicado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={font.className}>
        <AuthProvider>
          <TransactionProvider>{children}</TransactionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
