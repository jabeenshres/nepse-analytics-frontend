import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Navbar/sidebar";
import AppShell from "@/components/AppShell/appShell";
import { ThemeProvider } from "./lib/ThemeContext";
import { Suspense } from "react";
import LoadingBar from "@/components/LoadingBar/LoadingBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// The Roboto TTFs were declared but never referenced by any style or component;
// next/font preloaded ~944 KB on every first visit. Removed until actually used.

export const metadata = {
  title: "Share Nepal - Stock Analysis Platform",
  description: "Comprehensive Nepal Stock Exchange analysis, AI-powered predictions, and portfolio management",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/sharelogom.png" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        <ThemeProvider>
          <Suspense fallback={null}>
            <LoadingBar />
          </Suspense>
          <AppShell sidebar={<Sidebar />}>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
