"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/app/stylesheet/Forgot-Password.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

export default function Reset() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `https://trekkyfy.onrender.com/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        toast.success("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        const data = await response.json();
        toast.custom(data.message || "Invalid or expired token.");
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.",error);
    }
  };

  return (
    <div className="fp">
      <div className="fp-img">
        <h1>Trekkyfy</h1>
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
