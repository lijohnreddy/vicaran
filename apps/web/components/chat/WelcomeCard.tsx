"use client";

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface WelcomeCardProps {
    onPromptSelect: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
    "Investigate the future of AI in healthcare",
    "Research climate change solutions",
    "Analyze cryptocurrency trends",
];

export function WelcomeCard({ onPromptSelect }: WelcomeCardProps) {
    return (
        <Card className="p-8 max-w-2xl w-full bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">Welcome to Scryb</h2>
            </div>

            <p className="text-muted-foreground mb-6">
                Start a new investigation by selecting a prompt below or type your own query.
            </p>

            <div className="space-y-2">
                <p className="text-sm font-medium mb-3">Try these examples:</p>
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => onPromptSelect(prompt)}
                        className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent hover:border-primary transition-colors"
                    >
                        <p className="text-sm">{prompt}</p>
                    </button>
                ))}
            </div>
        </Card>
    );
}
