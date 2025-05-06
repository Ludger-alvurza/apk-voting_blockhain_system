import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Voting App",
  description: "Ludger Blockchain Voting App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuroraBackground className="bg-dark">
            <Header />

            {children}
          </AuroraBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
