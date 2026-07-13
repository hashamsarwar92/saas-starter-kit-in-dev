// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Button from "@/lib/auth/ui/Button";
import { useUser } from "@clerk/nextjs";
import SignOutButton from "@/lib/auth/components/SignOutButton";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ActionButton = () => {
    return (
      <Button
        onClick={() => {
          setOpen(false);
          router.push(isSignedIn ? "/dashboard" : "/sign-in");
        }}
        className="w-full px-6 py-1 rounded-full bg-[#fcc875] text-black font-semibold hover:bg-white transition duration-300 text-center"
      >
        {isSignedIn ? "Dashboard" : "Sign In"}
      </Button>
    );
  };

  return (
    <header className="w-full fixed top-0 left-0 z-[9999]">
      <nav className="transition-all duration-300 border-b bg-[#000000] border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-[80px] h-16">
              <Image
                src="/next.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              SAAS Starter Kit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative pb-1 transition-colors duration-200 hover:text-[#fcc875]"
                  style={{ color: isActive ? "#fcc875" : "#FFFFFF" }}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] w-full transition-all duration-200 bg-[#fcc875] ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Action Button (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3">
            <ActionButton />
            <SignOutButton/>
          </div>

          {/* Mobile Interactive Trigger */}
          <button
            type="button"
            onClick={() => {
              setOpen(!open);
            }}
            className="md:hidden text-white p-2 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Panels */}
        {open && (
          <div className="md:hidden px-4 pb-6 space-y-4 border-t bg-[#0A0A0A] border-[#1A1A1A] absolute w-full left-0 top-full shadow-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block text-base px-3 py-2 rounded transition-all ${
                    isActive
                      ? "text-[#fcc875] border-l-2 border-[#fcc875] bg-[#111111]"
                      : "text-white hover:text-[#fcc875]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-2">
              <ActionButton />
              <SignOutButton/>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
