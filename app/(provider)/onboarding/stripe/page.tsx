"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OnboardingStripe() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    // In production: redirect to Stripe Connect onboarding
    await new Promise((r) => setTimeout(r, 2000));
    setConnected(true);
    setLoading(false);
  }

  function handleFinish() {
    router.push("/portal");
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          {["Verify", "Profile", "Pricing", "Payments"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-navy-deep text-white">{i + 1}</div>
              <span className="text-xs hidden sm:block text-charcoal font-medium">{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        {!connected ? (
          <Card>
            <CardHeader className="text-center">
              <CreditCard className="mx-auto h-10 w-10 text-navy-deep mb-2" />
              <h1 className="text-xl font-bold text-charcoal">Set up payments</h1>
              <p className="text-sm text-muted-foreground mt-1">Connect your bank account to receive payouts from patient bookings</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
                <p>MedBridge uses Stripe for secure payment processing.</p>
                <p>Patients pay at booking. Funds are deposited to your bank account within 2-3 business days after the appointment.</p>
                <p className="font-medium text-charcoal">Transaction fee: 12% flat per booking (waived for the first 90 days).</p>
              </div>
              <Button onClick={handleConnect} className="w-full bg-navy-deep hover:bg-navy-light text-white" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</> : "Connect with Stripe"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleFinish}>Skip for now</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <PartyPopper className="mx-auto h-12 w-12 text-amber-warm" />
              <h2 className="text-2xl font-bold text-charcoal">You&apos;re all set!</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">Your practice is now listed on MedBridge. Patients can find you, see your prices, and book appointments.</p>
              <div className="flex items-center justify-center gap-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" /> Payments connected
              </div>
              <Button onClick={handleFinish} className="bg-amber-warm hover:bg-amber-warm/90 text-white mt-4">Go to Your Dashboard</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
