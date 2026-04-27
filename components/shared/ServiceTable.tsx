import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  cashPrice: number;
  durationMin: number;
}

interface ServiceTableProps {
  services: Service[];
  providerSlug?: string;
  showBookButton?: boolean;
}

export function ServiceTable({ services, providerSlug, showBookButton = true }: ServiceTableProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Service</th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Category</th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Duration</th>
            <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Cash Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-sm text-charcoal">{service.name}</p>
                {service.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>
                )}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <Badge variant="secondary" className="capitalize text-xs">{service.category}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                {service.durationMin} min
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-base font-bold text-success">{formatCurrency(service.cashPrice)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
