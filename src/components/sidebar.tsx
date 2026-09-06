"use client";

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  ChevronsUpDown,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { usePathname } from "next/navigation";
import { ChangePasswordModal } from "@/components/change-password-modal";

interface SidenavbarProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function Sidenavbar({ children, user }: SidenavbarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const nameArray = name.split(" ");
    if (nameArray.length === 1) return nameArray[0].charAt(0).toUpperCase();
    return (nameArray[0].charAt(0) + nameArray[1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(user.name);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ...(user.role === "PEGAWAI" 
      ? [
          { name: "Absensi Selfie", icon: UserCheck, href: "/dashboard/absensi" },
        ] 
      : []),
    ...(user.role === "ADMIN" 
      ? [
          { name: "Data Pegawai", icon: Users, href: "/dashboard/pegawai" },
          { name: "Departemen", icon: Settings, href: "/dashboard/departemen" },
        ] 
      : []),
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } flex flex-col border-r bg-zinc-50/50 dark:bg-zinc-900/50 transition-all duration-300 ease-in-out`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className={`${isOpen ? "block" : "hidden"} flex items-center font-bold text-xl tracking-tight text-primary`}>
            HRIS Panel
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-2">
            {menuItems.map((item) => {
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full ${isOpen ? "justify-start" : "justify-center px-0"} ${
                      isActive
                        ? "bg-muted text-primary font-semibold" 
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                    }`}
                  >
                    <item.icon className={`${isOpen ? "mr-2" : ""} h-4 w-4 shrink-0`} />
                    {isOpen && <span className="truncate">{item.name}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="border-t p-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
              <div
                className={`flex items-center w-full h-12 rounded-md hover:bg-muted transition-colors ${
                  isOpen ? "justify-start px-2" : "justify-center px-0"
                }`}
              >
                <Avatar className="h-8 w-8 shrink-0 rounded-md">
                  <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isOpen && (
                  <>
                    <div className="ml-2 flex flex-1 flex-col items-start truncate">
                      <span className="text-sm font-medium leading-none mb-1">
                        {user.name || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full text-left">
                        {user.role}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  </>
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56"
              align={isOpen ? "end" : "center"}
              side={isOpen ? "top" : "right"}
              sideOffset={8}
            >
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8 rounded-md shrink-0">
                  <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <ChangePasswordModal>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer flex items-center">
                  <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Ubah Password</span>
                </DropdownMenuItem>
              </ChangePasswordModal>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-100 focus:text-red-700 dark:focus:bg-red-900/50 p-0">
                <form action={logoutAction} className="w-full">
                  <button type="submit" className="flex w-full items-center px-2 py-1.5">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-50/30">{children}</main>
    </div>
  );
}