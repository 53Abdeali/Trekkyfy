"use client";

import Image from "next/image";
import black from "@/app/Images/black.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "@/app/stylesheet/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const access_token = Cookies.get("access_token");

    if (access_token) {
      toast.success("You are already logged in.");
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in the both fields.");
    }

    try {
      const response = await fetch("https://trekkyfy.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        toast.success("Login successful");

        const cookieOption: Cookies.CookieAttributes = rememberMe
          ? { expires: 7, secure: true, sameSite: "Strict" }
          : {};

        const { access_token } = await response.json();
        Cookies.set("access_token", access_token, cookieOption);

        router.push("/dashboard");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
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
            alt="Side_TrekYatra"
            className="trek-log-left-image"
            priority
          />
        </div>
        <div className="trek-log-right">
          <form onSubmit={handleLogin}>
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
            <div className="log-btn-main">
              <div className="remember-me">
                <div>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe"> Remember Me</label>
                </div>
                <Link className="fp-link-txt" href="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <button className="log-btn" type="submit">
                Login
              </button>
              <Link className="reg-link-txt" href="/register">
                Don&apos;t have an account?Register Here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
