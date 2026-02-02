"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/stocks?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-lg shadow-sm"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Stock<span className="text-primary">Radar</span>
          </span>
        </Link>

        <div className="hidden flex-1 max-w-md mx-8 md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search stocks…"
              aria-label="Search stocks"
              className={cn(
                "h-10 w-full rounded-lg border border-input bg-background/50 pl-10 pr-4",
                "text-sm placeholder:text-muted-foreground backdrop-blur-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "transition-colors"
              )}
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
            onClick={() => router.push("/stocks")}
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {loading ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse hidden sm:block" />
          ) : user ? (
            <div className="hidden sm:block">
              <UserMenu />
            </div>
          ) : (
            <Button variant="default" size="sm" className="hidden sm:flex" asChild>
              <Link href="/auth/login">Masuk</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
