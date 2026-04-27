import Link from "next/link";
import {
  Search,
  CreditCard,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  BadgeDollarSign,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-navy-light/30 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="mb-6 border-amber-warm/40 text-amber-warm bg-amber-warm/10 px-3 py-1"
            >
              Now serving Dallas-Fort Worth
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Healthcare prices
              <br />
              shouldn&apos;t be a mystery.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              See transparent cash prices for Botox, fillers, and more from
              verified DFW providers. Compare against your insurance — often cash
              is cheaper.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-amber-warm hover:bg-amber-warm/90 text-white text-base h-12 px-6"
                )}
              >
                Find a Provider
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/eligibility"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/30 text-white hover:bg-white/10 text-base h-12 px-6"
                )}
              >
                Check My Insurance
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-amber-warm" />
                NPDB Verified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-amber-warm" />
                HSA/FSA Accepted
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-amber-warm" />
                No Surprise Bills
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Card */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">
              See the difference instantly
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
              We check your insurance benefits and show you a side-by-side
              comparison. No phone calls, no guessing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="overflow-hidden border-2 shadow-lg">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  <div className="p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Through Insurance
                    </p>
                    <p className="text-4xl font-bold text-danger">$187</p>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p>Provider charges: $250</p>
                      <p>Your deductible remaining: $1,200</p>
                      <p>Applied to deductible: $250</p>
                      <p>Your estimated cost: $187</p>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 bg-success-light/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-success">
                        Cash Price on MedBridge
                      </p>
                    </div>
                    <p className="text-4xl font-bold text-success">$79</p>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p>Transparent price, no surprise bills</p>
                      <p>HSA/FSA card accepted</p>
                      <p>Submit receipt to your HSA</p>
                      <p className="font-semibold text-success">You save $108</p>
                    </div>
                  </div>
                </div>
                <div className="bg-navy-deep/5 border-t border-border px-6 py-4">
                  <p className="text-sm text-navy-deep flex items-start gap-2">
                    <TrendingDown className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      You&apos;ve spent $850 of your $3,000 deductible. At your
                      trajectory, you&apos;ll hit your deductible in late October
                      —{" "}
                      <strong>paying cash now is cheaper than insurance.</strong>
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Example comparison for Botox (20 units) at Glow MedSpa, Plano TX.
              Actual savings vary by plan.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">
              How MedBridge works
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Three steps to healthcare that makes sense.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-navy-deep/10 flex items-center justify-center mb-5">
                <Search className="h-7 w-7 text-navy-deep" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                1. Search &amp; Compare
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse verified DFW providers with transparent cash prices.
                Optionally check your insurance to see which option saves you more.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-warm/10 flex items-center justify-center mb-5">
                <CreditCard className="h-7 w-7 text-amber-warm" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                2. Book &amp; Pay
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Book online and pay securely with any card — including HSA and
                FSA. Get a Good Faith Estimate before your visit.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-5">
                <FileCheck className="h-7 w-7 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                3. Get Your Receipt
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive an HSA-formatted receipt automatically. Submit it to your
                health savings account for reimbursement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-deep py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-3xl md:text-4xl font-bold">60%</p>
              <p className="text-sm text-white/60 mt-1">average savings vs insurance</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">15+</p>
              <p className="text-sm text-white/60 mt-1">verified providers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">$0</p>
              <p className="text-sm text-white/60 mt-1">surprise bills</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">4.8</p>
              <p className="text-sm text-white/60 mt-1">average rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Providers CTA */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <BadgeDollarSign className="mx-auto h-12 w-12 text-amber-warm mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">
              Are you a provider?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              List your practice on MedBridge and reach new patients at $0 ad
              spend. Transparent pricing attracts patients who are ready to book
              — no insurance headaches.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-navy-deep hover:bg-navy-light text-white text-base h-12 px-8"
                )}
              >
                List Your Practice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "text-base h-12 px-8"
                )}
              >
                Learn More
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No transaction fees for the first 90 days. 12% flat per-booking fee after.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-charcoal text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "Why is cash often cheaper than insurance?",
                a: "If you have a high-deductible health plan (HDHP), you're paying full price until you meet your deductible anyway. Cash prices at independent providers are typically 40-60% below hospital-system rates. MedBridge shows you both prices so you can make an informed choice.",
              },
              {
                q: "Can I use my HSA or FSA card?",
                a: "Yes! All MedBridge providers accept HSA and FSA cards. After your visit, we email you an HSA-formatted receipt that you can submit to your health savings account.",
              },
              {
                q: "How do you verify providers?",
                a: "Every provider on MedBridge is verified through the National Provider Identifier (NPI) registry and screened through the National Practitioner Data Bank (NPDB). We verify active state medical licenses before any listing goes live.",
              },
              {
                q: "What is a Good Faith Estimate?",
                a: "Under the No Surprises Act, self-pay patients have the right to a Good Faith Estimate before scheduling. MedBridge automatically generates one for every booking — you'll know exactly what you'll pay before your visit.",
              },
              {
                q: "Is MedBridge an insurance company?",
                a: "No. MedBridge is a marketplace that connects you with cash-pay healthcare providers. We don't pool premiums, shift risk, or pay for your care. We show you transparent prices and let you book directly.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="text-base font-semibold text-charcoal">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy-deep py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to save on healthcare?
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Browse transparent cash prices from verified DFW providers. No
            account needed to search.
          </p>
          <Link
            href="/search"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 bg-amber-warm hover:bg-amber-warm/90 text-white text-base h-12 px-8"
            )}
          >
            Find a Provider
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
