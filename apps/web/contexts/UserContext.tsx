"use client";

import { createContext, useContext, ReactNode } from "react";
import type { UserRole } from "@/lib/drizzle/schema/users";

export interface UserContextType {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: Date | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  value: UserContextType;
  children: ReactNode;
}

export function UserProvider({ value, children }: UserProviderProps) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
