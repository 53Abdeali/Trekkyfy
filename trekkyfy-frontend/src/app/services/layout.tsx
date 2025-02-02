import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Trekkyfy - Services",
  description: "Our aim is to provide best ever services to the user!",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="login-layout">{children}</div>;
}
