"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/stores/cart-store";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth state listener
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [userMenuOpen]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "?";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/spices", label: "Spices" },
    { href: "/fruits", label: "Seasonal Fruits" },
    { href: "/subscriptions", label: "Subscriptions" },
  ];

  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "py-2 px-4 top-3 left-3 right-3 rounded-2xl border border-white/15 bg-bark/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              : "py-4 px-6 bg-forest text-cream"
          }
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="font-heading text-2xl font-bold text-cream hover:text-gold transition-colors duration-500"
          >
            Harvest & Spice Co.
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`
                  relative transition-colors duration-300
                  ${scrolled ? "text-cream/80 hover:text-gold" : "text-cream hover:text-gold"}
                  after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px]
                  after:bg-gold after:transition-all after:duration-300
                  hover:after:w-full
                `}
              >
                {link.label}
              </a>
            ))}

            <span
              className={`w-px h-5 transition-colors duration-500 ${scrolled ? "bg-cream/20" : "bg-cream/30"}`}
              aria-hidden="true"
            />

            {/* Cart */}
            <a
              href="/cart"
              className={`relative flex items-center gap-1.5 transition-colors duration-300 ${scrolled ? "text-cream/80 hover:text-gold" : "text-cream hover:text-gold"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-cream text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </a>

            {/* Auth: Sign In or User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                  className={`
                    flex items-center gap-2 transition-all duration-300
                    ${scrolled
                      ? "bg-cream/10 hover:bg-cream/20 text-cream px-2 py-1.5 rounded-full border border-cream/15"
                      : "text-cream hover:text-gold px-2 py-1.5"
                    }
                  `}
                >
                  <span className="w-7 h-7 rounded-full bg-terracotta text-cream flex items-center justify-center text-xs font-bold">
                    {userInitial}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden animate-scale-in">
                    <div className="px-4 py-3 border-b border-cream-dark">
                      <p className="text-sm font-medium text-bark truncate">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs text-bark-light truncate">{user.email}</p>
                    </div>
                    <a href="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-bark hover:bg-cream transition-colors">
                      📦 My Orders
                    </a>
                    <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-bark hover:bg-cream transition-colors">
                      👤 Profile
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-spice-red hover:bg-spice-red/5 transition-colors border-t border-cream-dark"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className={`
                  flex items-center gap-1.5 transition-all duration-300
                  ${scrolled
                    ? "bg-cream/10 hover:bg-cream/20 text-cream px-3 py-1.5 rounded-full border border-cream/15"
                    : "text-cream hover:text-gold"
                  }
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Sign In
              </a>
            )}
          </nav>

          {/* Mobile: cart, user, hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="/cart"
              className="relative text-cream hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-cream text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </a>
            <a
              href="/login"
              className="text-cream hover:text-gold transition-colors"
              aria-label="Sign In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-cream hover:text-gold transition-colors p-1"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-5 flex flex-col justify-between relative">
                <span
                  className={`block h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-[9px]" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current rounded-full transition-all duration-200 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer Overlay ─── */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-bark/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <nav
          className={`
            absolute top-0 right-0 h-full w-[280px]
            bg-bark/70 backdrop-blur-xl border-l border-white/10
            transition-transform duration-400 ease-out
            flex flex-col
            ${menuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-cream/10">
            <span className="font-heading text-lg font-bold text-cream">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-cream/60 hover:text-cream transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/80 hover:text-cream hover:bg-cream/10 transition-all duration-200 text-base font-medium"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </a>
            ))}

            <div className="h-px bg-cream/10 my-4" />

            <a
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/80 hover:text-cream hover:bg-cream/10 transition-all duration-200 text-base font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Cart
            </a>

            <a
              href="/account/orders"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/80 hover:text-cream hover:bg-cream/10 transition-all duration-200 text-base font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              My Orders
            </a>
          </div>

          {/* Drawer Footer: Auth */}
          <div className="px-4 py-5 border-t border-cream/10 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-2 mb-2">
                  <span className="w-9 h-9 rounded-full bg-terracotta text-cream flex items-center justify-center text-sm font-bold shrink-0">
                    {userInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-cream truncate">{user.user_metadata?.full_name || "User"}</p>
                    <p className="text-xs text-cream/50 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-spice-red/40 text-spice-red hover:bg-spice-red/10 font-medium transition-all text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-terracotta hover:bg-terracotta-dark text-cream font-semibold transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Sign In
                </a>
                <a
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-cream/20 text-cream/80 hover:text-cream hover:border-cream/40 font-medium transition-all text-sm"
                >
                  Create Account
                </a>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
