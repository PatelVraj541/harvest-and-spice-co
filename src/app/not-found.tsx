import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <span className="text-6xl mb-6 block">🌿</span>
        <h1 className="font-heading text-4xl font-bold text-bark mb-4">404</h1>
        <p className="text-bark-light text-lg mb-8 max-w-md">
          This page seems to have gone out of season. Let&apos;s get you back to
          the good stuff.
        </p>
        <a
          href="/"
          className="inline-block bg-terracotta hover:bg-terracotta-dark text-cream font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-lg"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
