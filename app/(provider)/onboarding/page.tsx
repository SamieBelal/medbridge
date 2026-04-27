"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CheckCircle2, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NPPESResult {
  npi: string;
  name: string;
  credential: string;
  taxonomy: string;
  address: { line1: string; city: string; state: string; zip: string };
  phone: string;
}

export default function OnboardingStep1() {
  const router = useRouter();
  const [npi, setNpi] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NPPESResult | null>(null);
  const [error, setError] = useState("");
  const [baaAccepted, setBaaAccepted] = useState(false);

  async function handleLookup() {
    if (npi.length !== 10) { setError("NPI must be 10 digits"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/nppes/lookup?npi=${npi}`);
      if (!res.ok) { setError("NPI not found in the NPPES registry"); setLoading(false); return; }
      const data = await res.json();
      setResult(data);
    } catch { setError("Failed to look up NPI"); }
    setLoading(false);
  }

  function handleContinue() {
    if (!result || !baaAccepted) return;
    // In production: save NPI + license to Supabase provider record
    router.push("/onboarding/profile");
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Verify", "Profile", "Pricing", "Payments"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i === 0 ? "bg-navy-deep text-white" : "bg-muted text-muted-foreground"}`}>
                {i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === 0 ? "text-charcoal font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <Shield className="mx-auto h-8 w-8 text-navy-deep mb-2" />
            <h1 className="text-xl font-bold text-charcoal">Verify your credentials</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your NPI to get started</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="npi">National Provider Identifier (NPI)</Label>
              <div className="flex gap-2">
                <Input
                  id="npi"
                  placeholder="1234567890"
                  value={npi}
                  onChange={(e) => setNpi(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                />
                <Button onClick={handleLookup} disabled={loading || npi.length !== 10} className="bg-navy-deep hover:bg-navy-light text-white shrink-0">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            {result && (
              <div className="rounded-xl border border-success/30 bg-success/5 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-semibold text-sm text-charcoal">NPI Verified</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 ml-7">
                  <p><strong>{result.name}</strong> {result.credential && `(${result.credential})`}</p>
                  <p>{result.taxonomy}</p>
                  <p>{result.address.line1}, {result.address.city}, {result.address.state} {result.address.zip}</p>
                  <p>{result.phone}</p>
                </div>
              </div>
            )}

            {result && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="license">Texas Medical License Number</Label>
                  <Input id="license" placeholder="TX-MD-12345" />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={baaAccepted} onChange={(e) => setBaaAccepted(e.target.checked)} className="mt-1 h-4 w-4 rounded border-border" />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the MedBridge Business Associate Agreement (BAA) and confirm that I am a licensed healthcare provider in the state of Texas.
                  </span>
                </label>

                <Button onClick={handleContinue} disabled={!baaAccepted} className="w-full bg-navy-deep hover:bg-navy-light text-white">
                  Continue to Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
