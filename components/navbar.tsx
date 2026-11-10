"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Apple,
  List,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/components/ui/button";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "categories", label: "Categories", icon: List, href: "/categories" },
  { id: "products", label: "Products", icon: ShoppingCart, href: "/products" },
  { id: "foods", label: "Foods", icon: Apple, href: "/foods" },
  { id: "meals", label: "Meals", icon: LayoutDashboard, href: "/meals" },
] as const;

/**
 * Exactly one nav item may be active.
 * "Home" only lights up on the exact root; every other item also owns its
 * sub-routes (e.g. /categories/mens-vitality belongs to "Categories").
 */
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : "light");

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-input bg-background/95 backdrop-blur-md pb-4 pt-1.5",
        "touch-none"
      )}
    >
      {NAV_ITEMS.map((item) => {
        const ActiveIcon = item.icon;
        const isActive = isNavItemActive(item.href, pathname);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors touch-manipulation",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <ActiveIcon className="h-5 w-5" />
            <span className="leading-none">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={toggleTheme}
        className="h-9 w-9 rounded-full border border-input bg-background flex items-center justify-center text-muted-foreground hover:text-primary transition-colors touch-manipulation"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    </nav>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"/></svg>
  );
}

export default Navbar;
