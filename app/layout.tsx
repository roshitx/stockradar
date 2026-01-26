import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "StockRadar - Indonesian Stock Analysis",
  description: "Track Indonesian stocks with confidence. Real-time IDX data, charts, and personal watchlists.",
  metadataBase: new URL("https://stockradar.id"),
  openGraph: {
    title: "StockRadar - Indonesian Stock Analysis",
    description: "Track Indonesian stocks with confidence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="theme-color" content="hsl(0 0% 4%)" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="hsl(0 0% 100%)" media="(prefers-color-scheme: light)" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
