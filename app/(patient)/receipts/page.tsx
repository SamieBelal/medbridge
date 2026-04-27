import { Download, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const MOCK_RECEIPTS = [
  { id: "1", serviceName: "PRP Facial", providerName: "Radiance Skin Clinic", date: new Date(Date.now() - 10 * 86400000).toISOString(), amount: 69900, hsaEligible: true },
  { id: "2", serviceName: "Juvederm Ultra XC", providerName: "Glow MedSpa", date: new Date(Date.now() - 30 * 86400000).toISOString(), amount: 49900, hsaEligible: true },
  { id: "3", serviceName: "IPL Photofacial", providerName: "DFW Aesthetics", date: new Date(Date.now() - 60 * 86400000).toISOString(), amount: 35000, hsaEligible: true },
];

export const metadata = { title: "Receipts & HSA Documents" };

export default function ReceiptsPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy-deep text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Receipts & HSA Documents</h1>
          <p className="text-white/70 mt-1">Download HSA-formatted receipts for reimbursement</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-3">
          {MOCK_RECEIPTS.map((receipt) => (
            <Card key={receipt.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-charcoal">{receipt.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{receipt.providerName} &bull; {formatDate(receipt.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {receipt.hsaEligible && (
                    <Badge variant="secondary" className="text-xs">HSA Eligible</Badge>
                  )}
                  <span className="text-sm font-bold text-charcoal">{formatCurrency(receipt.amount)}</span>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
