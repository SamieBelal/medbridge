"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OnboardingProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ businessName: "", bio: "", address: "", city: "", zip: "", phone: "", website: "" });

  function update(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // In production: save to Supabase
    await new Promise((r) => setTimeout(r, 500));
    router.push("/onboarding/pricing");
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          {["Verify", "Profile", "Pricing", "Payments"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= 1 ? "bg-navy-deep text-white" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
              <span className={`text-xs hidden sm:block ${i <= 1 ? "text-charcoal font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-charcoal">Set up your profile</h1>
            <p className="text-sm text-muted-foreground">This is what patients will see on MedBridge</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Practice / Business Name</Label>
                <Input id="businessName" placeholder="Glow MedSpa" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">About Your Practice</Label>
                <textarea id="bio" placeholder="Tell patients about your experience, specialties, and what makes your practice unique..." value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={4} className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St, Suite 100" value={form.address} onChange={(e) => update("address", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Plano" value={form.city} onChange={(e) => update("city", e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="75024" value={form.zip} onChange={(e) => update("zip", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="(972) 555-0101" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="yoursite.com" value={form.website} onChange={(e) => update("website", e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Back</Button>
                <Button type="submit" className="flex-1 bg-navy-deep hover:bg-navy-light text-white" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Continue to Pricing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
