// Header.tsx
import React from "https://esm.sh/react@19";
import { Link } from "https://esm.sh/wouter@3.9.0";
import { Brain } from "https://esm.sh/lucide-react@0.562.0";

const Header: React.FC = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Brain size={18} />
            </div>
            <h1 className="text-lg font-serif font-bold tracking-tight text-foreground">
              Dynamics<span className="text-primary italic">Lab</span>
            </h1>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;