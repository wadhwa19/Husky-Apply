import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-primary to-accent" aria-hidden />
          <span className="font-semibold tracking-tight">Multi‑Page JS Export</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({ isActive }) => cn("text-muted-foreground hover:text-foreground", isActive && "text-foreground font-medium")}>Guide</NavLink>
          <NavLink to="/pages" className={({ isActive }) => cn("text-muted-foreground hover:text-foreground", isActive && "text-foreground font-medium")}>Pages</NavLink>
          <Button asChild size="sm">
            <a href="#how-it-works">Get JS for all pages</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
