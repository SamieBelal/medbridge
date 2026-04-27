import { InsuranceCheckForm } from "@/components/shared/InsuranceCheckForm";

export const metadata = {
  title: "Check Your Insurance",
};

export default function EligibilityPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4 py-12">
      <InsuranceCheckForm />
    </div>
  );
}
