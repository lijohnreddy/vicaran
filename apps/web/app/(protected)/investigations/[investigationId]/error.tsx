"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface InvestigationErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function InvestigationError({ error, reset }: InvestigationErrorProps) {
    useEffect(() => {
        console.error("Investigation page error:", error);
    }, [error]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-8 text-center">
                <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
                <h2 className="text-lg font-medium mb-2">
                    Something went wrong
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {error.message || "Failed to load investigation. Please try again."}
                </p>
                <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={reset}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Try again
                    </Button>
                    <Link href="/home">
                        <Button>
                            <Home className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
