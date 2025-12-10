import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/shared/nav-bar";
import { Footer } from "@/components/shared/footer";
import { navLinks } from "@/app/navLinks";
import { QueryProvider } from "@/components/query-provider";
import { ReceiptProvider } from "@/contexts/ReceiptContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Splitimize",
  description:
    "Smart bill-splitting app using OCR and AI to extract receipt items and split payments easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        {/* Umami Analytics Script */}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="1c92eba3-4b41-4abf-8b12-2197f98a2602"
        ></script>
      </head>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReceiptProvider>
              <div className="mx-2 grid min-h-dvh grid-rows-[auto_1fr_auto] md:mx-auto md:max-w-7xl">
                <header className="pt-2">
                  <NavBar title="Splitimize" links={navLinks} />
                </header>
                <main className="py-8">{children}</main>
                <footer className="flex flex-col items-center gap-4 pb-2">
                  <Footer />
                </footer>
              </div>
            </ReceiptProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
