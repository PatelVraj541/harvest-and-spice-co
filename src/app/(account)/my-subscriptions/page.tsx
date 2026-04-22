import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Subscriptions",
  description: "Manage your spice subscription boxes.",
};

export default function AccountSubscriptionsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-bark mb-6">My Subscriptions</h1>
      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
        <div className="p-12 text-center">
          <span className="text-5xl mb-4 block">📦</span>
          <h3 className="font-heading text-lg font-semibold text-bark mb-2">No active subscriptions</h3>
          <p className="text-bark-light text-sm mb-6">
            Subscribe to a monthly spice box and never run out of flavor.
          </p>
          <a
            href="/subscriptions"
            className="inline-block bg-terracotta hover:bg-terracotta-dark text-cream text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            View Plans
          </a>
        </div>
      </div>
    </div>
  );
}
