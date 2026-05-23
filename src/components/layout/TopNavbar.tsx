"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function TopNavbar() {
  const { user, logout, setAuthorStatus } = useAuth();

  const handleBecomeAuthor = () => {
    setAuthorStatus(true);
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Branding & Logo */}
        <div className="flex items-center gap-8">
          <Link href="/feed" className="flex items-center gap-2 group">
            <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-violet-600 transition-all duration-300">
              PIVOT
            </span>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-violet-600 border-violet-500/30 bg-violet-50 dark:bg-violet-950/20 px-1.5 py-0">
              Track B
            </Badge>
          </Link>
          
          <Link 
            href="/feed" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Discover Feed
          </Link>
        </div>

        {/* User Auth Interactions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.is_author ? (
                <Link href="/write">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
                  >
                    Write a Post
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleBecomeAuthor}
                  className="border-dashed hover:border-violet-500 hover:text-violet-500 transition-all duration-200"
                >
                  Become Author
                </Button>
              )}

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center border hover:bg-violet-200 dark:hover:bg-violet-900 border-violet-200 dark:border-violet-800 cursor-pointer">
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                    {user.email.substring(0, 2).toUpperCase()}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-lg border border-border/80 bg-background/95 backdrop-blur-md">
                  <div className="px-3.5 py-3 font-normal border-b border-border/40 bg-muted/20 rounded-t-xl">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">ID: {user.user_id}</p>
                      <p className="text-[10px] mt-1.5">
                        {user.is_author ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 text-[10px] font-bold">
                            Author Access
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] font-bold">
                            Reader Access
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <Link href="/feed" className="w-full cursor-pointer font-medium text-sm">
                      Platform Feed
                    </Link>
                  </DropdownMenuItem>
                  {user.is_author && (
                    <DropdownMenuItem>
                      <Link href="/write" className="w-full cursor-pointer font-medium text-sm">
                        Create Article
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer font-semibold py-2 text-sm text-red-600 hover:text-red-500 dark:hover:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 focus:text-red-600"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary font-semibold text-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
