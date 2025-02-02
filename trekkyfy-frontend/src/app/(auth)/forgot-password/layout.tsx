import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Trekkyfy - Forgot Password",
  description: "Reset the forgotten Password",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="forgot-layout">{children}</div>;
}
