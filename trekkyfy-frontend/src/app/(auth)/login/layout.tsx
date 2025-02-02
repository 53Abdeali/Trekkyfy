import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Trekkyfy - Login",
  description: "Login to Trekkyfy",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="login-layout">{children}</div>;
}
