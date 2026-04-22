import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Harvest & Spice Co.",
    default: "Harvest & Spice Co. — Premium Spices & Seasonal Fruits",
  },
  description:
    "Shop premium hand-picked spices and fresh seasonal fruits. From farm to your doorstep — curated spice boxes, organic turmeric, saffron, seasonal mangoes, and more.",
  keywords: [
    "premium spices",
    "seasonal fruits",
    "organic spices online",
    "fresh fruit delivery",
    "spice subscription box",
    "buy spices online India",
    "farm fresh fruits",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Harvest & Spice Co.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
