"use client";

import { cn } from "@/lib/utils";
import { Zap, Search } from "lucide-react";

interface ModeSelectorProps {
    value: "quick" | "detailed";
    onChange: (value: "quick" | "detailed") => void;
}

const MODES = [
    {
        id: "quick" as const,
        label: "Quick Search",
        description: "Fast analysis with 10-15 sources, ideal for breaking news",
        icon: Zap,
    },
    {
        id: "detailed" as const,
        label: "Detailed Inquiry",
        description: "Comprehensive investigation with 20-30 sources",
        icon: Search,
    },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps): React.JSX.Element {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Investigation Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MODES.map((mode) => {
                    const isSelected = value === mode.id;
                    const Icon = mode.icon;

                    return (
                        <button
                            key={mode.id}
                            type="button"
                            onClick={() => onChange(mode.id)}
                            className={cn(
                                "flex items-start gap-3 p-4 border rounded-lg text-left transition-all",
                                "hover:border-primary/50 hover:bg-muted/50",
                                isSelected
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-border"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 mt-0.5 shrink-0",
                                isSelected ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div>
                                <p className={cn(
                                    "font-medium",
                                    isSelected ? "text-primary" : "text-foreground"
                                )}>
                                    {mode.label}
                                </p>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {mode.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
