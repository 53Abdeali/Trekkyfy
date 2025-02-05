"use client";

import Image from "next/image";
import black from "@/app/Images/black.jpg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import "@/app/stylesheet/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

export default function Regsiter() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in the all fields.");
    }

    if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    try {
      const response = await fetch("https://trekkyfy.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        toast.success("Registration done successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        throw new Error("Registration Failed");
      }
    } catch (err) {
      console.error("Registration Failed",err);
    }
  };

  return (
    <div className="trek-log-main">
      <div className="trek-log-img">
       <h1>Trekkyfy</h1>
      </div>

      <div className="trek-log">
        <div className="trek-log-left">
          <Image
            src={black}
            alt="Side_Trekkyfy"
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
            <div className="input">
              <label className="label">Your role:</label>
              <div className="rdo-lbl-main">
                <label htmlFor="hiker" className="rdo-lbl">
                  <input
                    id="radio"
                    type="radio"
                    name="role"
                    value="hiker"
                    checked={role === "hiker"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-label">Hiker</span>
                </label>
                <label htmlFor="guide" className="rdo-lbl">
                  <input
                    id="guide"
                    type="radio"
                    name="role"
                    value="guide"
                    checked={role === "guide"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-label">Guide</span>
                </label>
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
