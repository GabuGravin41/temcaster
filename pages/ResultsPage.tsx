// ResultsPage.tsx
import React, { useEffect, useState } from "https://esm.sh/react@19";
import { Link, useLocation } from "https://esm.sh/wouter@3.9.0";
import { TestResult, DOMAIN_DESCRIPTIONS } from "../types.ts";
import { ResultsChart } from "../components/ResultsChart.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { ArrowLeft, Users, ChevronRight } from "https://esm.sh/lucide-react@0.562.0";

export default function ResultsPage() {
  const [_, setLocation] = useLocation();
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastTestResult");
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="-ml-4">
              <ArrowLeft className="mr-2 w-4 h-4" /> Home
            </Button>
          </Link>
          <Link href="/compare">
            <Button className="bg-primary text-white shadow-lg shadow-primary/20 rounded-full group">
              <Users className="mr-2 w-4 h-4" /> Run Dynamics Analysis <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
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

          <div className="space-y-8">
            {result.scores.map((score) => (
              <div key={score.domain} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg">{score.domain}</h3>
                  <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">{score.level} ({score.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${score.percentage}%` }} 
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  {DOMAIN_DESCRIPTIONS[score.domain.charAt(0)]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}