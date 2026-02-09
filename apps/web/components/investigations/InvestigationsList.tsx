"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileSearch } from "lucide-react";
import { InvestigationCard } from "./InvestigationCard";
import {
    InvestigationFilters,
    type StatusFilter,
    type ModeFilter,
    type SortOption,
} from "./InvestigationFilters";
import type { Investigation } from "@/lib/drizzle/schema";

interface InvestigationsListProps {
    investigations: Investigation[];
}

export function InvestigationsList({ investigations }: InvestigationsListProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
    const [sortOption, setSortOption] = useState<SortOption>("newest");

    // Filter and sort investigations
    const filteredInvestigations = useMemo(() => {
        let result = [...investigations];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (inv) =>
                    inv.title.toLowerCase().includes(query) ||
                    inv.brief.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter((inv) => inv.status === statusFilter);
        }

        // Mode filter
        if (modeFilter !== "all") {
            result = result.filter((inv) => inv.mode === modeFilter);
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOption === "newest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [investigations, searchQuery, statusFilter, modeFilter, sortOption]);

    function handleDeleted() {
        // Refresh the page to get updated list
        router.refresh();
    }

    return (
        <div className="space-y-6">
            <InvestigationFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                modeFilter={modeFilter}
                onModeChange={setModeFilter}
                sortOption={sortOption}
                onSortChange={setSortOption}
            />

            {filteredInvestigations.length > 0 ? (
                <div className="grid gap-3">
                    {filteredInvestigations.map((investigation) => (
                        <InvestigationCard
                            key={investigation.id}
                            investigation={investigation}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed rounded-lg">
                    <FileSearch className="h-10 w-10 text-muted-foreground mb-4" />
                    {investigations.length === 0 ? (
                        <>
                            <h3 className="font-medium mb-1">No investigations yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Start your first investigation to see it here.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="font-medium mb-1">No matching investigations</h3>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your search or filters.
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
