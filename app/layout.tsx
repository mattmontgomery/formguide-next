import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Form Guide — beta",
  description: "The latest and greatest Football Form Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={[inter.className, "bg-slate-700"].join(" ")}>
        <div
          className={clsx(
            "container mx-auto px-4 my-8 py-8  max-w-6xl",
            "bg-slate-100 dark:bg-slate-800",
            "text-black dark:text-white"
          )}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
