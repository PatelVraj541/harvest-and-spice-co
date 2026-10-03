"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check if email confirmation is required
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark text-center">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
                <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                <path d="m16 19 2 2 4-4" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-bark mb-2">Check Your Email</h2>
            <p className="text-bark-light mb-6">
              We&apos;ve sent a confirmation link to <strong className="text-bark">{email}</strong>.
              Click the link to activate your account.
            </p>
            <a
              href="/login"
              className="inline-block bg-forest hover:bg-forest-dark text-cream font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg"
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back link */}
        <a href="/" className="inline-flex items-center gap-1.5 text-sm text-bark-light hover:text-forest transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to store
        </a>

        <div className="text-center mb-8">
          <a href="/" className="inline-block font-heading text-2xl font-bold text-forest hover:text-forest-dark transition-colors mb-6">
            Harvest & Spice Co.
          </a>
          <h1 className="font-heading text-3xl font-bold text-bark mb-2">Join Us</h1>
          <p className="text-bark-light">Create an account to explore premium spices and seasonal fruits.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-spice-red/10 border border-spice-red/20 text-spice-red text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-bark mb-1.5">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bark mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bark mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50"
              />
              <p className="text-xs text-bark-light mt-1.5">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3 rounded-xl transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-bark-light mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-forest font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
