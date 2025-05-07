"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { toast } from "react-toastify";
import Routes from "@/data/routes";
const imagePlaceholder = "/image.png";
const logoPlaceholder = "/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You are already logged in");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (username.trim() && email.trim() && password.trim()) {
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(Routes.register, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        toast.success("Registration successful! Please log in.");
        router.push("/login");
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please fill all inputs");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <Image
          src={imagePlaceholder}
          alt="Register illustration"
          width={600}
          height={800}
          priority
          className="login-image"
        />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <Image
              src={logoPlaceholder}
              alt="Company logo"
              width={120}
              height={40}
              priority
            />
          </div>
          <div className="login-center">
            <h2>Create an account</h2>
            <p>Please enter your details to sign up</p>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
              />
              <input type="email" placeholder="Email" name="email" required />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required
                  minLength={8}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-icon"
                  />
                ) : (
                  <FaEye
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-icon"
                  />
                )}
              </div>
              <p className="password-hint">
                Password must be at least 8 characters
              </p>
              <div className="login-center-buttons">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-button"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            Already have an account? <Link href="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
