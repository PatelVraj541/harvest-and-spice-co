import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-dark">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          <aside className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-bark mb-4">
              Admin Panel
            </h2>
            <nav className="space-y-1">
              {[
                { href: "/admin/products", label: "Products", icon: "📦" },
                { href: "/admin/orders", label: "Orders", icon: "🧾" },
                { href: "/admin/subscriptions", label: "Subscriptions", icon: "🔄" },
                { href: "/admin/seasonal-rules", label: "Seasonal Rules", icon: "📅" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-bark-light hover:bg-white hover:text-bark transition-colors text-sm"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
