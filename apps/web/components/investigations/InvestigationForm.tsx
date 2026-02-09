"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ModeSelector } from "./ModeSelector";
import { SourceInput } from "./SourceInput";
import { createInvestigationAction } from "@/app/actions/investigations";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function InvestigationForm(): React.JSX.Element {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState("");
    const [brief, setBrief] = useState("");
    const [mode, setMode] = useState<"quick" | "detailed">("quick");
    const [sources, setSources] = useState<string[]>([]);

    const [errors, setErrors] = useState<{
        title?: string;
        brief?: string;
    }>({});

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!brief.trim()) {
            newErrors.brief = "Brief is required";
        } else if (brief.trim().length < 10) {
            newErrors.brief = "Brief should be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("brief", brief.trim());
            formData.append("mode", mode);
            formData.append("sources", JSON.stringify(sources));

            await createInvestigationAction(formData);
            // Redirect happens in the server action
        } catch (error) {
            console.error("Failed to create investigation:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to start investigation. Please try again."
            );
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                    Investigation Title
                </label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) setErrors({ ...errors, title: undefined });
                    }}
                    placeholder="e.g., Climate Policy Analysis 2024"
                    className={errors.title ? "border-destructive" : ""}
                    disabled={isSubmitting}
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="brief" className="text-sm font-medium">
                    Investigation Brief
                </label>
                <Textarea
                    id="brief"
                    value={brief}
                    onChange={(e) => {
                        setBrief(e.target.value);
                        if (errors.brief) setErrors({ ...errors, brief: undefined });
                    }}
                    placeholder="Describe what you want to investigate. Be specific about the topic, questions to answer, or claims to verify."
                    rows={4}
                    className={errors.brief ? "border-destructive" : ""}
                    disabled={isSubmitting}
                />
                {errors.brief && (
                    <p className="text-sm text-destructive">{errors.brief}</p>
                )}
            </div>

            <ModeSelector
                value={mode}
                onChange={setMode}
            />

            <SourceInput
                sources={sources}
                onChange={setSources}
            />

            <div className="pt-4">
                <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting Investigation...
                        </>
                    ) : (
                        "Start Investigation"
                    )}
                </Button>
            </div>
        </form>
    );
}
