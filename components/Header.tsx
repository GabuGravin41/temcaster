
// Header.tsx
import React from "https://esm.sh/react@19";
import { Link, useLocation } from "https://esm.sh/wouter@3.9.0";
import { Brain, BookOpen, Users, BarChart3 } from "https://esm.sh/lucide-react@0.562.0";
import { Button } from "./ui/button.tsx";

const Header: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => location === path ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground';

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
        
        <nav className="flex items-center gap-2 md:gap-4">
           <Link href="/results">
             <Button variant="ghost" className={`text-xs md:text-sm ${isActive('/results')}`}>
               <BarChart3 className="w-4 h-4 mr-2" /> Library
             </Button>
           </Link>
           <Link href="/compare">
             <Button variant="ghost" className={`text-xs md:text-sm ${isActive('/compare')}`}>
               <Users className="w-4 h-4 mr-2" /> Compare
             </Button>
           </Link>
           <Link href="/learn">
             <Button variant="ghost" className={`text-xs md:text-sm ${isActive('/learn')}`}>
               <BookOpen className="w-4 h-4 mr-2" /> Learn
             </Button>
           </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
