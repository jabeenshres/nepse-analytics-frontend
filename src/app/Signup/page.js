"use client";
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/constraints";
import { register_endpoint } from "../config/endpoint";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiLock, FiUser, FiMail, FiUserPlus, FiAlertCircle, FiCheck } from "react-icons/fi";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}${register_endpoint}`, {
        username,
        email,
        password,
      });
      console.log("Signup successful: ", response.data);
      router.push("/Login");
    } catch (error) {
      console.log("error", error);
      setError(error.response?.data?.username || error.response?.data?.email || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/sharelogom.png"
              width={56}
              height={56}
              alt="ShareNepal Logo"
            />
            <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>SHARE NEPAL</span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Nepal Stock Exchange Analysis Platform
          </p>
        </div>

        {/* Signup Form */}
        <div className="card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
              <FiUserPlus className="w-8 h-8" style={{ color: 'var(--color-success)' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Create Account</h1>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Join SHARE NEPAL today</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
                <input
                  type="password"
                  className="input-field pl-10"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--foreground-muted)' }}>
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
                <input
                  type="password"
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordsMatch && (
                  <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-success)' }} />
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-success w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <FiUserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Already have an account?{" "}
              <Link href="/Login" className="font-semibold hover:underline" style={{ color: 'var(--color-accent)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--foreground-muted)' }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
