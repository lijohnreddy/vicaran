"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "icon";
}

export function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const result = await logoutAction();

      if (result.success) {
        toast.success("Successfully logged out!");
        router.push("/");
      } else {
        toast.error(result.error || "Logout failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        onClick={handleLogout}
        disabled={isLoading}
        className="h-9 w-9 justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
