"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function StartChattingButton() {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.push("/")}
            size="lg"
            className="mt-2"
        >
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Chatting
        </Button>
    );
}
