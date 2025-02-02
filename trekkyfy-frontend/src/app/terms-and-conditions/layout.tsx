import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Trekkyfy - Terms & Condition",
  description: "Please read all the terms and conditions prior to your adventure.",
};

export default function TermsConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="login-layout">{children}</div>;
}
