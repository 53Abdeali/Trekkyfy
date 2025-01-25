"use client";

import Image from "next/image";
import trekyatra from "@/app/Images/ty.png";
import black from "@/app/Images/black.jpg";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import "@/app/stylesheet/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const logMetadata: Metadata = {
  title: "Trekyatra- Register",
  description: "Register to Trekyatra",
};

export default function Regsiter() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in the both fields.");
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Registration Failed");
      }
      router.push("/login");
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="trek-log-main">
      <div className="trek-log-img">
        <Image
          src={trekyatra}
          alt="Logo_TrekYatra"
          className="trek-log-image"
          priority
        />
      </div>

      <div className="trek-log">
        <div className="trek-log-left">
          <Image
            src={black}
            alt="Side_TrekYatra"
            className="trek-log-left-image"
            priority
          />
        </div>
        <div className="trek-log-right">
          <form onSubmit={handleRegister}>
          <div className="input">
              <label className="label" htmlFor="Username">
                Username
              </label>
              <div className="log-mail">
                <input
                  type="text"
                  className="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="username"
                  name="username"
                  autoComplete="true"
                />
              </div>
            </div>
            <div className="input">
              <label className="label" htmlFor="Email">
                Email
              </label>
              <div className="log-mail">
                <input
                  type="email"
                  className="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-id"
                  name="email"
                  autoComplete="true"
                />
              </div>
            </div>
            <div className="input">
              <label className="label" htmlFor="Password">
                Password
              </label>
              <div className="log-pass">
                <input
                  type={showPassword ? "text" : "password"}
                  className="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password-id"
                  name="password"
                  autoComplete="true"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon
                    className="icon"
                    icon={showPassword ? faEyeSlash : faEye}
                  />{" "}
                </span>
              </div>
            </div>
            <div className="input">
              <label className="label" htmlFor="Password">
                Confirm Password
              </label>
              <div className="log-pass">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="conf-password-id"
                  name="conf-password"
                  autoComplete="true"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    className="icon"
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />{" "}
                </span>
              </div>
            </div>
            <div className="log-btn-main">
              <button className="log-btn" type="submit">
                Register
              </button>
              <Link className="reg-link-txt" href="/login">
                Already have an account?Login Here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
