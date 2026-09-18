"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

import { DevPilotIcon } from "@/components/icons/devpilot-icon";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { dashboardNavGroups, isDashboardNavActive } from "@/lib/dashboard-nav";

export function AppShell({
    children,
    title,
    description,
    actions,
    hideHeader = false,
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    hideHeader?: boolean;
}) {
    const pathname = usePathname();
    const { data: user } = useCurrentUser();
    const { mutate: logout } = useLogout();

    return (
        <SidebarProvider>
            <Sidebar variant="inset">
                <SidebarHeader className="py-6 px-4">
                    <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="flex size-7 items-center justify-center rounded-full bg-primary shadow-sm">
                            <span className="text-white font-bold text-sm leading-none">λ</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base text-foreground leading-tight">DevPilot</span>
                            <span className="text-xs text-muted-foreground">Chat with your code</span>
                        </div>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    {dashboardNavGroups.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.href}>
                                            <Link href={item.href} className="flex-1 w-full outline-none">
                                                <SidebarMenuButton
                                                    isActive={isDashboardNavActive(pathname, item.href, item.exact)}
                                                >
                                                    <item.icon className="size-4" />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter className="p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="ghost" className="w-full justify-start gap-3 h-14 p-2 bg-card/20 hover:bg-card/40 border border-border/20 rounded-xl">
                                    <div className="flex w-full items-center gap-2">
                                        <Avatar className="size-8">
                                            <AvatarImage src={user?.avatarUrl ?? ""} />
                                            <AvatarFallback>{user?.displayName?.charAt(0) ?? "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start text-sm overflow-hidden">
                                            <span className="font-medium truncate w-full text-left">{user?.displayName ?? "User"}</span>
                                            <span className="text-xs text-muted-foreground truncate w-full text-left">@{user?.githubUsername ?? "Username"}</span>
                                        </div>
                                    </div>
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="start" side="top" className="w-56 rounded-xl border border-border/40 p-1 mb-2 bg-background/95 backdrop-blur shadow-xl">
                            <div className="flex flex-col p-2 mb-1">
                                <span className="font-semibold text-sm">{user?.displayName ?? "User"}</span>
                                <span className="text-xs text-muted-foreground">Connected via GitHub</span>
                            </div>
                            <DropdownMenuSeparator className="bg-border/40" />
                            <DropdownMenuGroup className="py-1">
                                <DropdownMenuItem>
                                    <Link href="/dashboard/settings" className="flex items-center w-full">
                                        <Settings className="mr-2 size-4 text-muted-foreground" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-border/40" />
                            <DropdownMenuItem onClick={() => logout()} className="py-2 text-muted-foreground hover:text-foreground">
                                <LogOut className="mr-2 size-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-transparent relative">
                <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_l_c_h/0.12),transparent_55%)] -z-10" />
                {!hideHeader && (
                    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/40 px-4 backdrop-blur-md">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <div className="min-w-0">
                                {title && (
                                    <h1 className="truncate font-heading text-sm font-medium">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="truncate text-xs text-muted-foreground">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {actions}
                                <ModeToggle />
                            </div>
                        </div>
                    </header>
                )}
                <div className="flex flex-1 flex-col relative z-0 p-6 h-[calc(100svh-3.5rem)] overflow-y-auto">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
