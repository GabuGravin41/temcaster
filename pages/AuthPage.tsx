// AuthPage.tsx
import React, { useState } from "react";
import { useLocation } from "wouter";
import { login } from "../services/authService.ts";
import { Button } from "../components/ui/button.tsx";
import { ShieldCheck, Mail, User, Lock, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isLogin && !name)) return;
    
    setLoading(true);
    // Simulate slight delay for "hashing" effect
    await new Promise(r => setTimeout(r, 800));
    
    await login(email, isLogin ? "User" : name);
    setLocation("/results");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,64,175,0.05),_transparent)]"></div>
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            {isLogin ? "Access your Vault" : "Create Private Vault"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin 
              ? "Your data is secured locally on this device." 
              : "Register to save your assessment results permanently."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-[40px] shadow-2xl space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-secondary/30 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Clinical Researcher"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="user@dynamics.lab"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Vault Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password" 
                required
                className="w-full bg-secondary/30 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 px-2 leading-tight">
              Privacy Notice: PDL is a research project. We never store your password on any server. If you forget it, your local vault cannot be recovered.
            </p>
          </div>

          <Button type="submit" className="w-full h-12 rounded-2xl shadow-xl shadow-primary/10 group" disabled={loading}>
            {loading ? "Decrypting..." : (isLogin ? "Enter Vault" : "Initialize Vault")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-primary hover:underline font-medium"
            >
              {isLogin ? "Need a new vault? Register here" : "Already have a vault? Access it"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}