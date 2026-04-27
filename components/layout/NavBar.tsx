"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/search", label: "Find a Provider" },
  { href: "/about", label: "About" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-navy-deep" />
          <span className="text-xl font-bold text-navy-deep">MedBridge</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal/70 hover:text-navy-deep transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amber-warm hover:bg-amber-warm/90 text-white"
            )}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-charcoal hover:text-navy-deep transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-4 mt-4 flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className={cn(buttonVariants({ variant: "outline" }))}
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    buttonVariants(),
                    "bg-amber-warm hover:bg-amber-warm/90 text-white"
                  )}
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
