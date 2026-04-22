import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monthly Spice Subscription Box",
  description:
    "Subscribe to our curated monthly spice box. Discover 4-5 premium, hand-picked spices every month with recipes and origin stories. Cancel anytime.",
  keywords: ["spice subscription box", "monthly spice delivery", "curated spice box India"],
};

export default function SubscriptionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-forest py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gold text-sm font-medium uppercase tracking-widest mb-4">
            Spice Subscription
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-6">
            Monthly Spice Discovery Box
          </h1>
          <p className="text-cream/80 max-w-xl mx-auto text-lg">
            A curated selection of 4-5 premium spices delivered to your doorstep
            every month. Each box includes recipe cards and origin stories.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-heading text-3xl font-bold text-center text-bark mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Choose Your Plan",
              desc: "Select monthly or quarterly delivery based on your cooking needs.",
              icon: "📋",
            },
            {
              step: "02",
              title: "We Curate & Ship",
              desc: "Our team hand-picks the finest seasonal spices and packs them fresh.",
              icon: "📦",
            },
            {
              step: "03",
              title: "Cook & Explore",
              desc: "Discover new flavors with recipe cards and origin stories in every box.",
              icon: "👨‍🍳",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="text-center bg-white rounded-2xl p-8 shadow-sm border border-cream-dark"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <span className="text-xs text-terracotta font-bold uppercase tracking-widest">
                Step {item.step}
              </span>
              <h3 className="font-heading text-xl font-semibold text-bark mt-2 mb-2">
                {item.title}
              </h3>
              <p className="text-bark-light text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="bg-cream-dark py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center text-bark mb-12">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-forest relative">
              <span className="absolute -top-3 left-8 bg-forest text-cream text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="font-heading text-2xl font-bold text-bark mb-2">
                Monthly Box
              </h3>
              <p className="text-bark-light mb-6 text-sm">
                4-5 premium spices, recipe cards, and origin stories delivered every month.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading text-4xl font-bold text-forest">₹499</span>
                <span className="text-bark-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-bark-light">
                {[
                  "4-5 premium spices per box",
                  "Curated recipe cards included",
                  "Free shipping",
                  "Cancel or pause anytime",
                  "Exclusive subscriber discounts",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-forest">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-semibold py-3 rounded-xl transition-all hover:shadow-lg">
                Subscribe Monthly
              </button>
            </div>

            {/* Quarterly Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark">
              <h3 className="font-heading text-2xl font-bold text-bark mb-2">
                Quarterly Discovery
              </h3>
              <p className="text-bark-light mb-6 text-sm">
                A larger box of 8-10 spices with a seasonal theme, delivered every 3 months.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading text-4xl font-bold text-forest">₹1,299</span>
                <span className="text-bark-light">/quarter</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-bark-light">
                {[
                  "8-10 premium spices per box",
                  "Seasonal theme (e.g., Winter Warmers)",
                  "Recipe booklet included",
                  "Free shipping",
                  "Best value — save ₹198",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-forest">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full border-2 border-forest text-forest hover:bg-forest hover:text-cream font-semibold py-3 rounded-xl transition-all">
                Subscribe Quarterly
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
