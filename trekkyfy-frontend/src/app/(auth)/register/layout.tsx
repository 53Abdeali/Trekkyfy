import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Trekkyfy - Register",
  description: "Register to Trekyatra",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="login-layout">{children}</div>;
}
