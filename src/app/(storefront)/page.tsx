import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Spices & Fresh Seasonal Fruits",
  description:
    "Shop hand-picked premium spices and farm-fresh seasonal fruits. Curated monthly spice boxes, organic turmeric, saffron, Alphonso mangoes, and more.",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-forest overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-gold font-medium text-sm tracking-widest uppercase mb-4 animate-fade-in">
              Farm to Doorstep
            </p>
            <h1 className="font-heading text-4xl md:text-6xl text-cream font-bold leading-tight mb-6 animate-slide-up">
              Premium Spices &<br />
              <span className="text-gold">Seasonal Fruits</span>
            </h1>
            <p className="text-cream/80 text-lg mb-8 max-w-lg animate-slide-up">
              Hand-picked from the finest farms. Experience the authentic
              flavors of nature with our curated collection of organic spices
              and farm-fresh seasonal fruits.
            </p>
            <div className="flex gap-4 animate-slide-up">
              <a
                href="/spices"
                className="bg-terracotta hover:bg-terracotta-dark text-cream px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Explore Spices
              </a>
              <a
                href="/fruits"
                className="border-2 border-cream/30 text-cream hover:border-gold hover:text-gold px-8 py-3 rounded-full font-medium transition-all"
              >
                Seasonal Fruits
              </a>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-forest-dark/50 to-transparent" />
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bark mb-4">
            Our Collection
          </h2>
          <p className="text-bark-light max-w-md mx-auto">
            Sourced from trusted farms, delivered fresh to your kitchen.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category cards will be dynamically populated */}
          {[
            {
              title: "Premium Spices",
              desc: "Hand-ground, aromatic spices from Kerala, Kashmir & beyond",
              href: "/spices",
              emoji: "🌿",
            },
            {
              title: "Seasonal Fruits",
              desc: "Farm-fresh fruits available only in their peak season",
              href: "/fruits",
              emoji: "🥭",
            },
            {
              title: "Spice Box Subscription",
              desc: "Curated monthly boxes of exotic spices delivered to you",
              href: "/subscriptions",
              emoji: "📦",
            },
          ].map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-cream-dark"
            >
              <span className="text-4xl mb-4 block">{cat.emoji}</span>
              <h3 className="font-heading text-xl font-semibold text-bark mb-2 group-hover:text-forest transition-colors">
                {cat.title}
              </h3>
              <p className="text-bark-light text-sm">{cat.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-cream-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center text-bark mb-12">
            Why Families Trust Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "🌱", title: "100% Organic", desc: "No pesticides, no chemicals — pure nature" },
              { icon: "🚚", title: "Farm Fresh", desc: "Sourced directly from trusted farmers" },
              { icon: "📅", title: "In Season Only", desc: "We sell fruits only when they're at peak freshness" },
              { icon: "💛", title: "Family Owned", desc: "A tradition of quality for three generations" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-heading font-semibold text-bark mb-1">
                  {item.title}
                </h3>
                <p className="text-bark-light text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-forest rounded-3xl p-12 md:p-16 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-4">
            Monthly Spice Discovery Box
          </h2>
          <p className="text-cream/80 max-w-lg mx-auto mb-8">
            Get a curated box of 4-5 premium spices delivered every month.
            Discover new flavors, recipes, and culinary adventures.
          </p>
          <a
            href="/subscriptions"
            className="inline-block bg-gold hover:bg-gold-dark text-bark font-semibold px-10 py-4 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Your Spice Journey — ₹499/month
          </a>
        </div>
      </section>
    </div>
  );
}
