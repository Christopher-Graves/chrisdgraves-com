import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christopher Graves | Engineer, Creator, Builder",
  description: "Principal Software Engineer. Co-founder of Cozmos. Creator exploring AI, storytelling, and the art of building things that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
