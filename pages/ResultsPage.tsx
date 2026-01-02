
// ResultsPage.tsx
import React, { useEffect, useState } from "https://esm.sh/react@19";
import { Link, useLocation } from "https://esm.sh/wouter@3.9.0";
import { TestResult } from "../types.ts";
import { TRAIT_DETAILS } from "../lib/content.ts";
import { ResultsChart } from "../components/ResultsChart.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { ArrowLeft, Users, ChevronRight, ChevronDown, BookOpen } from "https://esm.sh/lucide-react@0.562.0";

export default function ResultsPage() {
  const [_, setLocation] = useLocation();
  const [result, setResult] = useState<TestResult | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastTestResult");
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  if (!result) return null;

  const toggleExpand = (domain: string) => {
    setExpandedDomain(expandedDomain === domain ? null : domain);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="-ml-4">
              <ArrowLeft className="mr-2 w-4 h-4" /> Home
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/learn">
                <Button variant="outline" className="rounded-full hidden sm:flex">
                  <BookOpen className="mr-2 w-4 h-4" /> Model Guide
                </Button>
            </Link>
            <Link href="/compare">
                <Button className="bg-primary text-white shadow-lg shadow-primary/20 rounded-full group">
                <Users className="mr-2 w-4 h-4" /> Run Dynamics Analysis <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">Psychometric Profile</h1>
          <p className="text-lg text-muted-foreground">Neural architecture summary based on the OCEAN behavioral model.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <Card className="border-none shadow-none bg-secondary/30 p-4 rounded-[40px] h-fit">
            <CardHeader><CardTitle className="text-xl">Visualization</CardTitle></CardHeader>
            <CardContent><ResultsChart scores={result.scores} /></CardContent>
          </Card>

          <div className="space-y-6">
            {result.scores.map((score) => {
              const traitKey = score.domain.charAt(0);
              const content = TRAIT_DETAILS[traitKey];
              const isExpanded = expandedDomain === score.domain;

              return (
                <div key={score.domain} className={`space-y-4 transition-all duration-300 ${isExpanded ? 'bg-card p-6 rounded-[24px] border border-border shadow-sm' : ''}`}>
                  <div 
                    className="cursor-pointer group"
                    onClick={() => toggleExpand(score.domain)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-serif font-bold text-lg group-hover:text-primary transition-colors">{score.domain}</h3>
                      <div className="flex items-center gap-3">
                         <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">{score.level} ({score.percentage}%)</span>
                         <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${score.percentage}%` }} 
                      />
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-2">
                         {content.shortDesc} <span className="text-primary not-italic font-medium ml-1">Read more</span>
                      </p>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="animate-in fade-in slide-in-from-top-2 pt-2 space-y-4">
                      <p className="text-sm leading-relaxed text-foreground/90 border-l-2 border-primary/20 pl-4">
                        {content.fullDesc}
                      </p>
                      
                      <div className="bg-secondary/30 rounded-xl p-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Core Facets</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {content.facets.map(f => (
                            <div key={f.name} className="flex gap-2 items-start text-xs">
                              <span className="font-semibold text-primary shrink-0">{f.name}:</span>
                              <span className="text-muted-foreground">{f.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                         <Link href="/learn">
                            <Button size="sm" variant="ghost" className="text-xs h-8">
                               View Full {score.domain} Guide <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                         </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
