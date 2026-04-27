import Link from "next/link";
import { Shield } from "lucide-react";

const footerLinks = {
  marketplace: [
    { href: "/search", label: "Find a Provider" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About Us" },
  ],
  providers: [
    { href: "/auth/register", label: "List Your Practice" },
    { href: "/auth/login", label: "Provider Login" },
  ],
  legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "BAA Template" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-navy-deep" />
              <span className="text-lg font-bold text-navy-deep">MedBridge</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[240px]">
              Transparent cash-pay healthcare in Dallas-Fort Worth. Real prices before you book.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Marketplace</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-navy-deep transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">For Providers</h3>
            <ul className="space-y-2">
              {footerLinks.providers.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-navy-deep transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-navy-deep transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MedBridge. All rights reserved. Dallas-Fort Worth, Texas.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>NPDB Verified Providers</span>
            <span>&bull;</span>
            <span>HSA/FSA Accepted</span>
            <span>&bull;</span>
            <span>No Surprise Bills</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
