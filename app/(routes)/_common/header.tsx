"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginLink, LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, getUser } = useKindeBrowserClient();
  const isDark = theme === "dark";
  return (
    <div className="sticky top-0 right-0 left-0 z-30">
      <header className="h-16 border-b bg-background py-4">
        <div
          className="w-full max-w-6xl mx-auto 
            flex items-center justify-between"
        >
          <Logo />

          <div className="flex-1">
            <Link href="/" className="text-foreground-muted text-sm">
              Home
            </Link>
          </div>
          <div
            className="flex flex-1 items-center
                justify-end gap-3"
          >
            <Button
              className="relative rounded-full h-8 w-8"
              variant="outline"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <SunIcon
                className={cn(
                  "absolute h-5 w-5 transition",
                  isDark ? "scale-100" : "scale-0",
                )}
              />
              <MoonIcon
                className={cn(
                  "absolute h-5 w-5 transition",
                  isDark ? "scale-0" : "scale-100",
                )}
              />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 shrink-0 rounded-full">
                  <AvatarImage
                    src={user?.picture || ""}
                    alt={user?.given_name || ""}
                   />
                 <AvatarFallback className="rounded-lg">
                   {user?.given_name?.charAt(0)}
                   {user?.family_name?.charAt(0)}
                 </AvatarFallback>
                </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                        My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogoutLink className="w-full flex items-center">
                            <LogOutIcon className="size-4" />
                            Logout
                        </LogoutLink>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginLink>
                <Button>Sign in</Button>
              </LoginLink>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
