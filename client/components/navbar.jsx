"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  Search,
  Bell,
  User,
  Menu,
  User2Icon,
  LogOutIcon,
  Coffee,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { navLinks } from "@/constant";

import { UserAuth } from "@/context/AuthContext";
import { getUserByUID } from "@/user_api";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, googleSignIn, logout, setSavedUser } = UserAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const response = await getUserByUID(user.uid);
          localStorage.setItem("user", JSON.stringify(response.data));

          setSavedUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 w-fulltransition-all duration-200 bg-background">
      <div className=" flex w-full h-16 sm:px-16 py-2 lg:px-8 px-4 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-8 w-8 text-secondary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
            </div>
            <span className="font-bold sm:inline-block">Exclutch</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((navlink, index) => (
              <Link
                key={index}
                href={navlink.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {navlink.title}
              </Link>
            ))}

            
          </nav>

        </div>
        
        <div className="flex items-center gap-4">
          

          

          <ModeToggle />

          {user ? (
            <>
              {/* Notifications Icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-brand" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>New comment on your note</DropdownMenuItem>
                  <DropdownMenuItem>Your note was featured</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/notifications">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border"
                    aria-label="User menu"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User2Icon /> Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <Button
                variant={"ghost"}
                className="cursor-pointer"
                onClick={googleSignIn}
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative h-10 w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 p-0">
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-6 py-4">
                  <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Navigation
                  </SheetTitle>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-6 py-4 bg-white dark:bg-black">
                  <div className="space-y-2">
                    {navLinks.map((navlink, index) => (
                      <Link
                        key={index}
                        href={navlink.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200"
                      >
                        {navlink.icon && (
                          <navlink.icon className="h-5 w-5 flex-shrink-0" />
                        )}
                        {navlink.title}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800" />

                {/* Footer/Auth Section */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  {user ? (
                    <div className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.email?.[0] || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full justify-center text-sm font-medium"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        Sign in to access your account
                      </p>
                      <Button
                        onClick={googleSignIn}
                        className="w-full justify-center text-sm font-medium"
                      >
                        Sign In with Google
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
