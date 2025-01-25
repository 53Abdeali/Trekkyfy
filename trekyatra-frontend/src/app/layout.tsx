import type { Metadata } from "next";
import Head from "next/head";
export const metadata: Metadata = {
  title: "TrekYatra",
  description: "Hike and outdoor with an experienced local.",
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
