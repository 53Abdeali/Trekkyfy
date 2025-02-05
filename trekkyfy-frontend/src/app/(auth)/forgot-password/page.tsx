"use client";

import { useState } from "react";
import Link from "next/link";
import "@/app/stylesheet/Forgot-Password.css";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Forgot() {
  const [email, setEmail] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://trekkyfy.onrender.com/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success(
          "If the email is registered, a reset link has been sent."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Unable to process the request.", error);
    }
  };
  return (
    <div className="fp">
      <div className="fp-img">
        <h1>Trekkyfy</h1>
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
            <div className="fp-btn-main">
              <button className="fp-btn" type="submit">
                Reset Password
              </button>
            </div>
            <div className="back-to-login">
              <FontAwesomeIcon className="btl-icon" icon={faArrowLeft} />
              <Link className="btl-link" href="/login">
                <p>Back to Login</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
