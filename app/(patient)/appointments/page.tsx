import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const MOCK_APPOINTMENTS = [
  { id: "1", providerName: "Glow MedSpa", serviceName: "Botox (20 units)", appointmentAt: new Date(Date.now() + 5 * 86400000).toISOString(), status: "confirmed", amount: 7900 },
  { id: "2", providerName: "Radiance Skin Clinic", serviceName: "PRP Facial", appointmentAt: new Date(Date.now() - 10 * 86400000).toISOString(), status: "completed", amount: 69900 },
  { id: "3", providerName: "Glow MedSpa", serviceName: "Juvederm Ultra XC", appointmentAt: new Date(Date.now() - 30 * 86400000).toISOString(), status: "completed", amount: 49900 },
  { id: "4", providerName: "DFW Aesthetics", serviceName: "IPL Photofacial", appointmentAt: new Date(Date.now() - 60 * 86400000).toISOString(), status: "completed", amount: 35000 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-amber-warm/10 text-amber-warm",
  completed: "bg-navy-deep/10 text-navy-deep",
  cancelled: "bg-danger/10 text-danger",
};

export const metadata = { title: "Your Appointments" };

export default function AppointmentsPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy-deep text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Your Appointments</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-3">
          {MOCK_APPOINTMENTS.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy-deep/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-5 w-5 text-navy-deep" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-charcoal">{apt.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{apt.providerName} &bull; {formatDate(apt.appointmentAt)}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <Badge className={cn("text-xs", statusColors[apt.status])}>{apt.status}</Badge>
                  <span className="text-sm font-bold text-charcoal">{formatCurrency(apt.amount)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
