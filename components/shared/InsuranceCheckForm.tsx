"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PAYER_LIST } from "@/lib/constants";

interface InsuranceCheckFormProps {
  serviceId?: string;
  providerSlug?: string;
}

export function InsuranceCheckForm({ serviceId, providerSlug }: InsuranceCheckFormProps) {
  const router = useRouter();
  const [payerId, setPayerId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payer = PAYER_LIST.find((p) => p.id === payerId);
      const res = await fetch("/api/eligibility/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payerId,
          payerName: payer?.name || payerId,
          memberId,
          dateOfBirth: dob,
          serviceType: serviceId,
        }),
      });

      if (!res.ok) throw new Error("Failed to check eligibility");

      const data = await res.json();

      // Store result in sessionStorage for the comparison page
      sessionStorage.setItem("eligibilityResult", JSON.stringify(data));

      const params = new URLSearchParams();
      if (providerSlug) params.set("provider", providerSlug);
      if (serviceId) params.set("service", serviceId);

      router.push(`/compare?${params.toString()}`);
    } catch {
      setError("Unable to check eligibility. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center pb-2">
        <Shield className="mx-auto h-8 w-8 text-navy-deep mb-2" />
        <h2 className="text-xl font-bold text-charcoal">Check your insurance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          We&apos;ll compare your insurance cost to the cash price
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payer">Insurance Provider</Label>
            <select
              id="payer"
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              required
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select your insurer...</option>
              {PAYER_LIST.map((payer) => (
                <option key={payer.id} value={payer.id}>
                  {payer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="memberId">Member ID</Label>
            <Input
              id="memberId"
              placeholder="ABC123456789"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-navy-deep hover:bg-navy-light text-white"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Check My Benefits
          </Button>
        </form>

        <p className="mt-4 text-xs text-center text-muted-foreground">
          Your information is encrypted and only used to check eligibility.
          We never store your insurance credentials.
        </p>
      </CardContent>
    </Card>
  );
}
