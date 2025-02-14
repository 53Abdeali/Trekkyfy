import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Trekkyfy - Explore",
  description: "Explore the various treks and trails uploaded by Trekkyfy and paln your journey accordingly",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="explore-layout">{children}</div>;
}
