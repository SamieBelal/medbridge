import Link from "next/link";
import { CalendarDays, Receipt, Star, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

// Mock data — will come from Supabase queries
const MOCK_UPCOMING = [
  {
    id: "1",
    providerName: "Glow MedSpa",
    providerSlug: "glow-medspa-plano",
    serviceName: "Botox (20 units)",
    appointmentAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "confirmed" as const,
    amount: 7900,
  },
];

const MOCK_PAST = [
  {
    id: "2",
    providerName: "Radiance Skin Clinic",
    providerSlug: "radiance-skin-frisco",
    serviceName: "PRP Facial",
    appointmentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed" as const,
    amount: 69900,
    hasReview: false,
  },
  {
    id: "3",
    providerName: "Glow MedSpa",
    providerSlug: "glow-medspa-plano",
    serviceName: "Juvederm Ultra XC",
    appointmentAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed" as const,
    amount: 49900,
    hasReview: true,
  },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-amber-warm/10 text-amber-warm",
  completed: "bg-navy-deep/10 text-navy-deep",
  cancelled: "bg-danger/10 text-danger",
};

export default function PatientDashboard() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy-deep text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-white/70 mt-1">Your MedBridge dashboard</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/search" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-auto py-4 flex-col gap-1")}>
            <CalendarDays className="h-5 w-5 text-navy-deep" />
            <span className="text-sm font-medium">Book Appointment</span>
          </Link>
          <Link href="/eligibility" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-auto py-4 flex-col gap-1")}>
            <CheckCircle2 className="h-5 w-5 text-amber-warm" />
            <span className="text-sm font-medium">Check Insurance</span>
          </Link>
          <Link href="/receipts" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-auto py-4 flex-col gap-1")}>
            <Receipt className="h-5 w-5 text-success" />
            <span className="text-sm font-medium">HSA Receipts</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming */}
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-4">Upcoming Appointments</h2>
            {MOCK_UPCOMING.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                  <Link href="/search" className={cn(buttonVariants({ size: "sm" }), "bg-navy-deep hover:bg-navy-light text-white")}>
                    Find a Provider
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {MOCK_UPCOMING.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm text-charcoal">{apt.serviceName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{apt.providerName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{formatDate(apt.appointmentAt)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={cn("text-xs", statusColors[apt.status])}>
                            {apt.status}
                          </Badge>
                          <p className="text-sm font-bold text-success mt-2">{formatCurrency(apt.amount)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past Visits */}
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-4">Recent Visits</h2>
            <div className="space-y-3">
              {MOCK_PAST.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-charcoal">{apt.serviceName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{apt.providerName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(apt.appointmentAt)}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm font-bold text-charcoal">{formatCurrency(apt.amount)}</p>
                        {!apt.hasReview && (
                          <Link href="#" className="text-xs text-amber-warm hover:underline flex items-center gap-1 justify-end">
                            <Star className="h-3 w-3" /> Leave Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link href="/appointments" className="inline-flex items-center gap-1 text-sm text-navy-deep hover:underline mt-4">
              View all appointments <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
