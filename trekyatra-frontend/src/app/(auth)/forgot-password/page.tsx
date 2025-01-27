"use client";

import { useState } from "react";
import Image from "next/image";
import trekyatra from "@/app/Images/ty.png";
import "@/app/stylesheet/Forgot-Password.css";
import { toast } from "react-hot-toast";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("If the email is registered, a reset link has been sent.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Unable to process the request.");
    }
  };
  return (
    <div className="fp">
      <div className="fp-img">
        <Image
          src={trekyatra}
          alt="Logo_TrekYatra"
          className="fp-image"
          priority
        />
      </div>
      <div className="forgot-pass">
        <h1>Forgot Password</h1>
        <div className="forgot-form">
          <form onSubmit={handleForgot}>
            <label className="fp-lbl">Email</label>
            <div className="fp-inp-main">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fp-inp"
                required
              />
            </div>
            {message && <span className="fp-msg">{message}</span>}
            <div className="fp-btn-main">
              <button className="fp-btn" type="submit">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
