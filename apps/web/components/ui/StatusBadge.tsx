import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Investigation status type matching database enum
export type InvestigationStatus = "pending" | "active" | "completed" | "partial" | "failed";

// Status configuration with colors and human-readable labels
const STATUS_CONFIG: Record<InvestigationStatus, { label: string; className: string }> = {
    pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    },
    active: {
        label: "In Progress",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    completed: {
        label: "Completed",
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    },
    partial: {
        label: "Partial",
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    },
    failed: {
        label: "Failed",
        className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    },
};

interface StatusBadgeProps {
    status: InvestigationStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps): React.JSX.Element {
    const config = STATUS_CONFIG[status];

    return (
        <Badge
            variant="outline"
            className={cn(config.className, className)}
        >
            {config.label}
        </Badge>
    );
}
