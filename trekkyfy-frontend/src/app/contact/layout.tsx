import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Trekkyfy - Contact",
  description: "User can contact to Trekkyfy either directly or by filling the form.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="login-layout">{children}</div>;
}
