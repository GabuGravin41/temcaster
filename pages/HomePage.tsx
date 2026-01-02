
import React from 'https://esm.sh/react@19';
import { Link } from 'https://esm.sh/wouter@3.9.0';
import { Button } from "../components/ui/button.tsx";
import { ArrowRight, Brain, Activity, Users, BookOpen } from "https://esm.sh/lucide-react@0.562.0";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
      <section className="relative px-6 py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/10">
            <Activity className="w-4 h-4" />
            <span>Full 120-Item IPIP-NEO-PI-R Scientific Assessment</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight leading-tight max-w-4xl">
            Understand the <span className="text-primary italic">dynamics</span> of your family.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The biggest conflict in any society is often the difference in personalities. 
            Our platform uses the comprehensive 120-question Big Five scale to scientifically map temperaments (approx. 10 mins).
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/test">
              <Button size="lg" className="rounded-full cursor-pointer h-14 px-8 text-lg">
                Start Assessment <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/learn">
              <Button variant="outline" size="lg" className="rounded-full cursor-pointer h-14 px-8 text-lg bg-background/50">
                <BookOpen className="mr-2 w-5 h-5" /> Explore the Science
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif">Neuroscience Backed</h3>
            <p className="text-muted-foreground text-sm">Clinical OCEAN model diagnostics using the full 120-item inventory for maximum accuracy.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif">Family Dynamics</h3>
            <p className="text-muted-foreground text-sm">Identify potential friction zones between parents and children via detailed profile comparison.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif">Actionable Logic</h3>
            <p className="text-muted-foreground text-sm">Tailored strategies for long-term harmony based on statistical personality overlap.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
