"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiLock, FiUser, FiLogIn, FiAlertCircle } from "react-icons/fi";

/** Only allow same-site relative redirects (blocks //evil.com, https://...). */
function safeNextPath() {
  if (typeof window === "undefined") return "/";
  const next = new URLSearchParams(window.location.search).get("next") || "/";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Same-origin route: it calls Django over loopback, sets the httpOnly
      // cookie, and returns before we navigate.
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Hard navigation: bypasses the client router cache, which may still hold
      // an unauthenticated prefetch of "/".
      window.location.assign(safeNextPath());
    } catch {
      setError("Unable to reach the login service. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" prefetch={false} className="inline-flex items-center gap-3">
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

        {/* Login Form */}
        <div className="card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-accent)', opacity: 0.1 }}>
              <FiLogIn className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Welcome Back</h1>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground-secondary)' }}>
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Signup is disabled for now: only invited/admin-created accounts can log in.
          Re-enable this block together with src/app/Signup/page.js.
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Don&apos;t have an account?{" "}
              <Link href="/Signup" className="font-semibold hover:underline" style={{ color: 'var(--color-accent)' }}>
                Sign up
              </Link>
            </p>
          </div>
          */}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--foreground-muted)' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
