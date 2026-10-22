"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { withBase } from "@/lib/base-path";

const links = [
  { label: "Essays", href: "/essays" },
  { label: "Thoughts", href: "/thoughts" },
  { label: "Seeing", href: "/seeing" },
  { label: "Reading", href: "/reading" },
  { label: "About", href: "/about" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--nav-shadow)" : "none",
      }}
    >
      <div
        className="mx-auto max-w-5xl px-6 flex items-center justify-between transition-all duration-300"
        style={{ paddingTop: scrolled ? "12px" : "20px", paddingBottom: scrolled ? "12px" : "20px" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center opacity-90 hover:opacity-100 transition-opacity">
          <img src={withBase("/logo.svg")} alt="Value Yonder" style={{ height: scrolled ? "24px" : "30px", transition: "height 0.3s ease", filter: "var(--logo-filter)" }} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  active
                    ? "text-white bg-[var(--surface-active)]"
                    : "text-neutral-400 hover:text-white hover:bg-[var(--surface-hover)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle className="ml-1" />
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1">
        <ThemeToggle />
        <button
          className="p-2 text-neutral-400 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-px bg-current transition-all duration-200 ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-1"
          style={{ background: "var(--nav-menu-bg)", borderBottom: "1px solid var(--nav-border)" }}
        >
          {links.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  active
                    ? "text-white bg-[var(--surface-active)]"
                    : "text-neutral-400 hover:text-white hover:bg-[var(--surface-hover)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
