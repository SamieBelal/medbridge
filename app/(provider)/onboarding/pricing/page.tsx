"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SERVICE_CATEGORIES } from "@/lib/constants";

interface ServiceEntry { name: string; category: string; price: string; duration: string }

export default function OnboardingPricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceEntry[]>([
    { name: "", category: "botox", price: "", duration: "30" },
  ]);

  function addService() { setServices([...services, { name: "", category: "botox", price: "", duration: "30" }]); }
  function removeService(i: number) { setServices(services.filter((_, idx) => idx !== i)); }
  function updateService(i: number, field: keyof ServiceEntry, value: string) {
    const updated = [...services];
    updated[i] = { ...updated[i], [field]: value };
    setServices(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    router.push("/onboarding/stripe");
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          {["Verify", "Profile", "Pricing", "Payments"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= 2 ? "bg-navy-deep text-white" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
              <span className={`text-xs hidden sm:block ${i <= 2 ? "text-charcoal font-medium" : "text-muted-foreground"}`}>{label}</span>
              {i < 3 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-charcoal">Set your prices</h1>
            <p className="text-sm text-muted-foreground">Add the services you offer with transparent cash prices</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {services.map((svc, i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3 relative">
                  {services.length > 1 && (
                    <button type="button" onClick={() => removeService(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="space-y-2">
                    <Label>Service Name</Label>
                    <Input placeholder="Botox (20 units)" value={svc.name} onChange={(e) => updateService(i, "name", e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select value={svc.category} onChange={(e) => updateService(i, "category", e.target.value)} className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm">
                        {SERVICE_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Cash Price ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input className="pl-7" placeholder="79" value={svc.price} onChange={(e) => updateService(i, "price", e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (min)</Label>
                      <Input placeholder="30" value={svc.duration} onChange={(e) => updateService(i, "duration", e.target.value)} required />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addService} className="w-full gap-1">
                <Plus className="h-4 w-4" /> Add Another Service
              </Button>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Back</Button>
                <Button type="submit" className="flex-1 bg-navy-deep hover:bg-navy-light text-white" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Continue to Payments
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
