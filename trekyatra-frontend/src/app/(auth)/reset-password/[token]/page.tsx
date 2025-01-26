"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import trekyatra from "@/app/Images/ty.png";
import "@/app/stylesheet/Forgot-Password.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Reset() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setMessage(data.message || "Invalid or expired token.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fp">
      <div className="fp-img">
        <Image
          src={trekyatra}
          alt="TrekYatra Logo"
          className="fp-image"
          priority
        />
      </div>

      <div className="forgot-pass">
        <h1>Reset Password</h1>
        <div className="forgot-form">
          <form onSubmit={handleResetPassword}>
            <label className="fp-lbl">Password</label>
            <div className="rst-inp-main">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="fp-inp"
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon
                  className="rst-icon"
                  icon={showPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>

            <label className="fp-lbl">Confirm Password</label>
            <div className="rst-inp-main">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="fp-inp"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  className="rst-icon"
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>

            {message && <span className="fp-msg">{message}</span>}

            <div className="fp-btn-main">
              <button className="fp-btn" type="submit">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
