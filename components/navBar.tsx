"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AnchorIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/words", label: "My Words" },
];

export default function NavBar({ username }: { username?: string | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      logout();
    });
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-neutral-950/80 backdrop-blur-md shadow-sm border-b border-neutral-800/60"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex items-center justify-center rounded-xl bg-neutral-900 p-1.5 text-white transition-transform group-hover:scale-110">
              <AnchorIcon className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              Word<span className="text-neutral-400">Anchor</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-neutral-800"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {username ? (
              <>
                <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                  <UserIcon className="h-3.5 w-3.5" />
                  {username}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3.5 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  <LogOutIcon className="h-3.5 w-3.5" />
                  {isPending ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 shadow-lg"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-1 flex flex-col gap-2 border-t border-neutral-800 pt-3">
                {username ? (
                  <>
                    <span className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400">
                      <UserIcon className="h-3.5 w-3.5" />
                      Signed in as{" "}
                      <strong className="text-neutral-200">{username}</strong>
                    </span>
                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      {isPending ? "Signing out…" : "Sign out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-3 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-3 rounded-lg bg-neutral-900 text-sm font-medium text-white text-center hover:bg-neutral-700 transition-colors"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
