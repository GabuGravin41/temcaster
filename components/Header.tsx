// Header.tsx
import React from "react";
import { Link, useLocation } from "wouter";
import { Brain, BookOpen, Users, BarChart3, LogOut, Shield } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { getSession, logout, isAuthenticated } from "../services/authService.ts";

const Header: React.FC = () => {
  const [location] = useLocation();
  const session = getSession();
  const isAuth = isAuthenticated();

  const isActive = (path: string) => location.startsWith(path) ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground';

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <Brain size={18} />
              </div>
              <h1 className="text-lg font-serif font-bold tracking-tight text-foreground hidden md:block">
                Dynamics<span className="text-primary italic">Lab</span>
              </h1>
            </div>
          </Link>

          {isAuth && (
            <div className="hidden lg:flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                Vault Active: {session?.name}
              </span>
            </div>
          )}
        </div>
        
        <nav className="flex items-center gap-1 md:gap-3">
           <Link href="/results">
             <Button variant="ghost" className={`text-[10px] md:text-xs h-9 ${isActive('/results')}`}>
               <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Library
             </Button>
           </Link>
           <Link href="/compare">
             <Button variant="ghost" className={`text-[10px] md:text-xs h-9 ${isActive('/compare')}`}>
               <Users className="w-3.5 h-3.5 mr-1.5" /> Compare
             </Button>
           </Link>
           <Link href="/learn">
             <Button variant="ghost" className={`text-[10px] md:text-xs h-9 ${isActive('/learn')}`}>
               <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Learn
             </Button>
           </Link>

           {isAuth ? (
             <Button 
                variant="ghost" 
                onClick={logout}
                className="text-[10px] md:text-xs h-9 text-red-500/70 hover:text-red-500 hover:bg-red-50"
             >
               <LogOut className="w-3.5 h-3.5" />
             </Button>
           ) : (
             <Link href="/auth">
               <Button variant="primary" className="text-[10px] md:text-xs h-8 px-4 rounded-full">
                 Sign In
               </Button>
             </Link>
           )}
        </nav>
      </div>
    </header>
  );
};

export default Header;