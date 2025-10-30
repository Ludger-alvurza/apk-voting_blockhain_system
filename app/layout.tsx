import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ThemeProvider } from "next-themes";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            <SpeedInsights />
          </AuroraBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
