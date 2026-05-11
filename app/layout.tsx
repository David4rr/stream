import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/store/provider";
import { GlobalAppShell } from "@/components/app-shell/GlobalAppShell";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dramz - Streaming Drama",
  description: "Platform streaming drama terbaik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={nunitoSans.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <GlobalAppShell>{children}</GlobalAppShell>
            </Suspense>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
