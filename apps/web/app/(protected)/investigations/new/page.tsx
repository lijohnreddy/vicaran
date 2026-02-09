import { InvestigationForm } from "@/components/investigations/InvestigationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewInvestigationPage() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Link
                href="/home"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-bold tracking-tight">
                    New Investigation
                </h1>
                <p className="text-muted-foreground">
                    Configure your investigation and let AI do the research.
                </p>
            </div>

            <InvestigationForm />
        </div>
    );
}
