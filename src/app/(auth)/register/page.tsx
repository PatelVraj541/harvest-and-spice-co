import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Harvest & Spice Co. account to start shopping.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-bark mb-2">Join Us</h1>
          <p className="text-bark-light">Create an account to explore premium spices and seasonal fruits.</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark">
          <form className="space-y-5">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-bark mb-1.5">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                placeholder="Your full name"
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
                placeholder="you@example.com"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3 rounded-xl transition-all hover:shadow-lg"
            >
              Create Account
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
