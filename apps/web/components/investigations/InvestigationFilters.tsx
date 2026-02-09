"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type StatusFilter = "all" | "pending" | "active" | "completed" | "partial" | "failed";
export type ModeFilter = "all" | "quick" | "detailed";
export type SortOption = "newest" | "oldest";

interface InvestigationFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: StatusFilter;
    onStatusChange: (status: StatusFilter) => void;
    modeFilter: ModeFilter;
    onModeChange: (mode: ModeFilter) => void;
    sortOption: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export function InvestigationFilters({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    modeFilter,
    onModeChange,
    sortOption,
    onSortChange,
}: InvestigationFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search investigations..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Filters Row */}
            <div className="flex gap-2">
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>

                {/* Mode Filter */}
                <Select value={modeFilter} onValueChange={(v) => onModeChange(v as ModeFilter)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="quick">Quick</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortOption} onValueChange={(v) => onSortChange(v as SortOption)}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
