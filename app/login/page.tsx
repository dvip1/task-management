"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { toast } from "react-toastify";
import Routes from "@/data/routes";

// Import your own images or use placeholders
// Replace these with your actual image paths
const imagePlaceholder = "/image.png";
const logoPlaceholder = "/logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // For the form submission itself
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Use renamed login, get auth context's isLoading
  const router = useRouter();

  // Redirect if already logged in (and auth state is determined)
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      // toast.success("You are already logged in."); // Consider if this toast is needed on every check
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const passwordInput = form.elements.namedItem(
      "password",
    ) as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email.length > 0 && password.length > 0) {
      try {
        const response = await fetch(Routes.login, {
          // Your backend login endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Login failed. Please check your credentials.",
          );
        }

        if (data.user) {
          login(data.user); // Call the context's login function with user data
          toast.success("Login successful!");
          router.push("/dashboard"); // Navigate after context update
        } else {
          // This would be an unexpected API response if login was successful
          console.error("Login API success, but no user data returned:", data);
          toast.error(
            "Login succeeded but user data was not available. Please try again.",
          );
        }
      } catch (err: any) {
        console.error("Login page error:", err);
        toast.error(
          err.message || "An unexpected error occurred during login.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill in both email and password.");
      setIsSubmitting(false);
    }
  };

  // Show loading indicator while the AuthContext is figuring out the initial auth state
  if (isAuthLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading authentication state...
      </div>
    );
  }

  // If already authenticated and not loading, the useEffect above should have redirected.
  // This is a fallback or if the redirect hasn't happened yet.
  if (isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Already logged in. Redirecting...
      </div>
    );
  }

  return (
    <div className="login-main">
      <div className="login-left">
        <Image
          src={imagePlaceholder}
          alt="Login illustration"
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
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLoginSubmit}>
              <input type="email" placeholder="Email" name="email" required />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required
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
              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <Link href="/forgot-password" className="forgot-pass-link">
                  Forgot password?
                </Link>
              </div>
              <div className="login-center-buttons">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="login-button"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            {"Don't have an account?"} <Link href="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
