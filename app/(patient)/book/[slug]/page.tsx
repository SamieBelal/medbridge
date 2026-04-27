"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, CreditCard, FileText, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";

// Mock services for the provider (matches seed data for glow-medspa-plano)
const MOCK_SERVICES: Record<string, { name: string; services: { id: string; name: string; cashPrice: number; durationMin: number }[] }> = {
  "glow-medspa-plano": {
    name: "Glow MedSpa",
    services: [
      { id: "s1", name: "Botox (20 units)", cashPrice: 7900, durationMin: 30 },
      { id: "s2", name: "Botox (40 units)", cashPrice: 14900, durationMin: 45 },
      { id: "s3", name: "Juvederm Ultra XC (1 syringe)", cashPrice: 49900, durationMin: 45 },
      { id: "s4", name: "PRP Facial", cashPrice: 75000, durationMin: 60 },
      { id: "s5", name: "Laser Skin Resurfacing", cashPrice: 120000, durationMin: 90 },
    ],
  },
  "dfw-aesthetics-arlington": {
    name: "DFW Aesthetics & Wellness",
    services: [
      { id: "s6", name: "Botox (20 units)", cashPrice: 8500, durationMin: 30 },
      { id: "s7", name: "Restylane Lyft (1 syringe)", cashPrice: 55000, durationMin: 45 },
      { id: "s8", name: "IPL Photofacial", cashPrice: 35000, durationMin: 45 },
      { id: "s9", name: "PRP Hair Restoration", cashPrice: 95000, durationMin: 60 },
    ],
  },
};

// Generate next 14 days of available time slots
function generateTimeSlots() {
  const slots: { date: string; label: string; times: string[] }[] = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0) continue; // skip Sunday
    slots.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      times: d.getDay() === 6
        ? ["9:00 AM", "10:00 AM", "11:00 AM"]
        : ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
    });
  }
  return slots;
}

export default function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const provider = MOCK_SERVICES[slug];
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const timeSlots = generateTimeSlots();
  const service = provider?.services.find((s) => s.id === selectedService);

  async function handleCheckout() {
    setLoading(true);
    // In production: call /api/payments/checkout to create Stripe session
    // For now: simulate and redirect
    await new Promise((r) => setTimeout(r, 1500));
    alert("Stripe Checkout would open here. Booking confirmed!");
    setLoading(false);
    router.push("/dashboard");
  }

  if (!provider) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream gap-4 px-4">
        <p className="text-muted-foreground">Provider not found.</p>
        <Link href="/search" className={cn(buttonVariants(), "bg-navy-deep hover:bg-navy-light text-white")}>
          Browse Providers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Link */}
        <Link href={`/provider/${slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-navy-deep mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to {provider.name}
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { num: 1, label: "Service", icon: FileText },
            { num: 2, label: "Date & Time", icon: CalendarDays },
            { num: 3, label: "Review & Pay", icon: CreditCard },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                step >= s.num ? "bg-navy-deep text-white" : "bg-muted text-muted-foreground"
              )}>
                {s.num}
              </div>
              <span className={cn("text-sm hidden sm:block", step >= s.num ? "text-charcoal font-medium" : "text-muted-foreground")}>
                {s.label}
              </span>
              {s.num < 3 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-charcoal">Select a service</h2>
              <p className="text-sm text-muted-foreground">at {provider.name}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {provider.services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => { setSelectedService(svc.id); setStep(2); }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                    selectedService === svc.id
                      ? "border-navy-deep bg-navy-deep/5"
                      : "border-border hover:border-navy-deep/30"
                  )}
                >
                  <div>
                    <p className="font-medium text-sm text-charcoal">{svc.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {svc.durationMin} min
                    </p>
                  </div>
                  <span className="text-lg font-bold text-success">{formatCurrency(svc.cashPrice)}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-charcoal">Pick a date & time</h2>
              <p className="text-sm text-muted-foreground">{service?.name} at {provider.name}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSlots.slice(0, 7).map((slot) => (
                  <div key={slot.date}>
                    <p className="text-sm font-semibold text-charcoal mb-2">{slot.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time) => (
                        <button
                          key={`${slot.date}-${time}`}
                          onClick={() => { setSelectedDate(slot.date); setSelectedTime(time); setStep(3); }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-sm transition-all",
                            selectedDate === slot.date && selectedTime === time
                              ? "border-navy-deep bg-navy-deep text-white"
                              : "border-border hover:border-navy-deep/50 text-charcoal"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6" onClick={() => setStep(1)}>
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Pay */}
        {step === 3 && service && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-charcoal">Review & Pay</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium text-charcoal">{provider.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-charcoal">{service.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-charcoal">
                    {selectedDate && new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-charcoal">{selectedTime}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="text-xl font-bold text-success">{formatCurrency(service.cashPrice)}</span>
                </div>
              </div>

              {/* GFE Notice */}
              <div className="rounded-xl border border-navy-deep/20 bg-navy-deep/5 p-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-navy-deep mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy-deep">Good Faith Estimate</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Under the No Surprises Act, you have the right to receive a Good Faith Estimate of expected charges.
                      Your total estimated cost is <strong>{formatCurrency(service.cashPrice)}</strong>. This is the complete price — no additional fees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes for the provider (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any allergies, concerns, or questions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Payment badges */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Accepted:</span>
                <Badge variant="secondary" className="text-xs">Credit/Debit</Badge>
                <Badge variant="secondary" className="text-xs">HSA</Badge>
                <Badge variant="secondary" className="text-xs">FSA</Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button
                  className="flex-1 bg-amber-warm hover:bg-amber-warm/90 text-white"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="mr-2 h-4 w-4" /> Pay {formatCurrency(service.cashPrice)}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
