
// LearnPage.tsx
import React from "https://esm.sh/react@19";
import { Link } from "https://esm.sh/wouter@3.9.0";
import { TRAIT_DETAILS } from "../lib/content.ts";
import { Button } from "../components/ui/button.tsx";
import { ArrowLeft, BookOpen, Activity } from "https://esm.sh/lucide-react@0.562.0";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="-ml-4">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back Home
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">The <span className="text-primary italic">Big Five</span> Model</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Five Factor Model (FFM), also known as the Big Five, is the most scientifically validated model of personality in academic psychology. 
            It breaks down human temperament into five distinct dimensions (OCEAN), each composed of various sub-facets.
          </p>
        </div>

        <div className="grid gap-12">
          {Object.entries(TRAIT_DETAILS).map(([key, trait]) => (
            <section key={key} id={trait.title} className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {key}
                  </div>
                  <h2 className="text-3xl font-serif">{trait.title}</h2>
                </div>
                
                <p className="text-xl font-light leading-relaxed text-foreground/90">
                  {trait.fullDesc}
                </p>

                <div className="pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Key Facets of {trait.title}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    {trait.facets.map((facet) => (
                      <div key={facet.name} className="space-y-1">
                        <h4 className="font-semibold text-foreground">{facet.name}</h4>
                        <p className="text-sm text-muted-foreground leading-normal">
                          {facet.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="bg-secondary/30 rounded-[32px] p-10 text-center space-y-6">
           <h2 className="text-2xl font-serif">Ready to discover your profile?</h2>
           <Link href="/test">
             <Button size="lg" className="rounded-full px-8">Take the Assessment</Button>
           </Link>
        </div>

      </div>
    </div>
  );
}
