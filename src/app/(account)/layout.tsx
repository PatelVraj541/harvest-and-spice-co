import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-1">
          <h2 className="font-heading text-xl font-bold text-bark mb-4">My Account</h2>
          <nav className="space-y-1">
            {[
              { href: "/account/orders", label: "Orders", icon: "📦" },
              { href: "/account/my-subscriptions", label: "Subscriptions", icon: "🔄" },
              { href: "/profile", label: "Profile", icon: "👤" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-bark-light hover:bg-cream-dark hover:text-bark transition-colors text-sm"
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
