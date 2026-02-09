"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Clock,
  User,
  LogIn,
  Menu,
  ChevronLeft,
  PanelLeftIcon,
  LogOut,
  Home,
  Plus,
  Shield,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/app/actions/auth";
import { SidebarThemeSwitcher } from "@/components/SidebarThemeSwitcher";
import Logo from "../Logo";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, isMobile, toggleSidebar } = useSidebar();
  const { id: userId, role: userRole } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Build navigation items based on user role
  const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/history", label: "History", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
    ...(userRole === "admin"
      ? [{ href: "/admin/models", label: "Admin", icon: Shield }]
      : []),
  ];

  const renderContentAsOpen = open || isMobile;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await logoutAction();

      if (result.success) {
        toast.success("Successfully logged out!");
        router.push("/");
      } else {
        toast.error(result.error);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      toast.error(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = () => {
    // On mobile, collapse the sidebar when a nav item is clicked
    if (isMobile) {
      toggleSidebar();
    }
  };

  const getLinkClasses = (href: string) => {
    const isActive =
      href === "/home"
        ? pathname.startsWith("/home") || pathname.startsWith("/investigations")
        : href.startsWith("/admin")
          ? pathname.startsWith("/admin")
          : pathname === href;
    return cn(
      "flex items-center w-full rounded-md text-base font-medium transition-colors",
      isActive
        ? "bg-primary text-white [&>*]:text-white"
        : "hover:bg-white dark:hover:bg-gray-800",
      renderContentAsOpen ? "px-3 py-2" : "h-9 w-9 justify-center p-0"
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarHeader
        className={cn(
          "flex items-center gap-2 h-14 border-b",
          renderContentAsOpen
            ? "flex-row justify-between px-4"
            : "justify-center px-2"
        )}
      >
        {/* Only show logo when expanded */}
        {renderContentAsOpen && (
          <Logo className="pl-2 text-xl" width={26} height={26} />
        )}

        {/* Desktop collapse button */}
        {!isMobile && (
          <SidebarTrigger
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={open}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            {open ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </SidebarTrigger>
        )}

        {/* Mobile close button - only show on mobile when sidebar is open */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="p-1 h-auto w-auto"
            onClick={() => toggleSidebar()}
          >
            <PanelLeftIcon className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2 flex flex-col">
        {/* New Investigation CTA */}
        <div className={cn(
          "mb-4",
          renderContentAsOpen ? "px-2" : "flex justify-center"
        )}>
          <Link href="/investigations/new" onClick={handleNavClick}>
            <Button
              className={cn(
                "gap-2",
                renderContentAsOpen ? "w-full" : "h-9 w-9 p-0"
              )}
            >
              <Plus className="h-4 w-4" />
              {renderContentAsOpen && "New Investigation"}
            </Button>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => (
              <SidebarMenuItem
                key={item.href}
                className={cn(
                  "flex justify-center",
                  renderContentAsOpen && "px-2"
                )}
              >
                <Link
                  href={item.href}
                  className={getLinkClasses(item.href)}
                  onClick={handleNavClick}
                >
                  <item.icon
                    className={cn(
                      renderContentAsOpen ? "h-6 w-6 mr-3" : "h-5 w-5"
                    )}
                  />
                  {renderContentAsOpen && <span>{item.label}</span>}
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 border-t flex flex-col space-y-2">
        {/* Theme switcher */}
        <div
          className={cn(
            "flex w-full",
            renderContentAsOpen ? "justify-start px-3" : "justify-center"
          )}
        >
          <SidebarThemeSwitcher />
        </div>

        {/* Logout/Login */}
        {userId ? (
          renderContentAsOpen ? (
            <LogoutButton />
          ) : (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </Button>
            </div>
          )
        ) : (
          <Link href="/auth/login" className="w-full">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center",
                renderContentAsOpen
                  ? "w-full justify-start px-3"
                  : "h-8 w-8 justify-center"
              )}
            >
              <LogIn
                className={cn(renderContentAsOpen ? "h-5 w-5 mr-3" : "h-5 w-5")}
              />
              {renderContentAsOpen && "Login"}
              {!renderContentAsOpen && <span className="sr-only">Login</span>}
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
