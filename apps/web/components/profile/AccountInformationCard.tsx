"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { EditableFullName } from "./EditableFullName";
import { useUser } from "@/contexts/UserContext";
import { formatDate } from "@/lib/utils";

export function AccountInformationCard() {
  const { email, created_at } = useUser();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle>Account Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <p className="text-sm">{email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Full Name
          </label>
          <EditableFullName />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Member Since
          </label>
          <p className="text-sm">{formatDate(created_at)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
