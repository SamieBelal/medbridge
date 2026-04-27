import Link from "next/link";
import { CalendarDays, Users, DollarSign, Star, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const MOCK_STATS = { bookingsThisMonth: 24, revenue: 2847600, patients: 18, avgRating: 4.7 };

const MOCK_UPCOMING = [
  { id: "1", patientName: "Maria G.", serviceName: "Botox (20 units)", appointmentAt: new Date(Date.now() + 2 * 86400000).toISOString(), amount: 7900 },
  { id: "2", patientName: "Jennifer L.", serviceName: "PRP Facial", appointmentAt: new Date(Date.now() + 3 * 86400000).toISOString(), amount: 75000 },
  { id: "3", patientName: "Ashley R.", serviceName: "Juvederm Ultra XC", appointmentAt: new Date(Date.now() + 5 * 86400000).toISOString(), amount: 49900 },
];

export default function ProviderDashboard() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy-deep text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <p className="text-white/70 mt-1">Glow MedSpa</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Bookings This Month", value: MOCK_STATS.bookingsThisMonth, icon: CalendarDays, color: "text-navy-deep" },
            { label: "Revenue This Month", value: formatCurrency(MOCK_STATS.revenue), icon: DollarSign, color: "text-success" },
            { label: "Active Patients", value: MOCK_STATS.patients, icon: Users, color: "text-amber-warm" },
            { label: "Average Rating", value: MOCK_STATS.avgRating, icon: Star, color: "text-amber-warm" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">Upcoming Appointments</h2>
              <Link href="/portal/appointments" className="text-sm text-navy-deep hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_UPCOMING.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-charcoal">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{apt.serviceName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(apt.appointmentAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-success">{formatCurrency(apt.amount)}</p>
                      <Badge className="mt-1 bg-success/10 text-success text-xs">confirmed</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-4">Quick Links</h2>
            <div className="space-y-2">
              {[
                { href: "/portal/appointments", label: "Manage Appointments", icon: CalendarDays },
                { href: "/portal/patients", label: "Patient Roster", icon: Users },
                { href: "/portal/payouts", label: "Payouts", icon: DollarSign },
                { href: "/portal/reviews", label: "Reviews", icon: Star },
                { href: "/portal/profile", label: "Edit Listing", icon: TrendingUp },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start gap-2")}
                >
                  <link.icon className="h-4 w-4 text-navy-deep" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
