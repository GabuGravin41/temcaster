// ComparePage.tsx
import React, { useEffect, useState } from "https://esm.sh/react@19";
import { Link, useLocation } from "https://esm.sh/wouter@3.9.0";
import { DomainScore, TestResult, AnalysisResult } from "../types.ts";
import { ResultsChart } from "../components/ResultsChart.tsx";
import { Button } from "../components/ui/button.tsx";
import { BrainCircuit, Loader2, ArrowLeft, RefreshCw, Zap, Dna, ShieldAlert } from "https://esm.sh/lucide-react@0.562.0";

function generateChildProfile(parentScores: DomainScore[]): DomainScore[] {
  return parentScores.map(s => {
    let newScore = s.level === "High" ? 30 : s.level === "Low" ? 70 : 50;
    newScore += Math.floor(Math.random() * 40) - 20; 
    newScore = Math.max(5, Math.min(95, newScore));
    
    let level: "Low" | "Neutral" | "High" = "Neutral";
    if (newScore < 40) level = "Low";
    else if (newScore > 60) level = "High";

    return { ...s, score: (newScore / 100) * s.maxScore, percentage: newScore, level };
  });
}

export default function ComparePage() {
  const [_, setLocation] = useLocation();
  const [parentResult, setParentResult] = useState<TestResult | null>(null);
  const [childScores, setChildScores] = useState<DomainScore[] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lastTestResult");
    if (saved) {
      const parsed = JSON.parse(saved);
      setParentResult(parsed);
      setChildScores(generateChildProfile(parsed.scores));
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const regenerateChild = () => {
    if (parentResult) {
      setChildScores(generateChildProfile(parentResult.scores));
      setAiAnalysis(null);
    }
  };

  const handleAiAnalysis = async () => {
    if (!parentResult || !childScores) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeRelationship(parentResult.scores, childScores);
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please check console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!parentResult || !childScores) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/results">
            <Button variant="ghost" className="-ml-4">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Results
            </Button>
          </Link>
          <div className="flex gap-4">
            <Button variant="outline" onClick={regenerateChild} className="rounded-full">
              <RefreshCw className="mr-2 w-4 h-4" /> New Simulation
            </Button>
            <Button 
              onClick={handleAiAnalysis} 
              disabled={isAnalyzing}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-xl shadow-primary/20"
            >
              {isAnalyzing ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <BrainCircuit className="mr-2 w-4 h-4" />}
              AI Deep Diagnosis
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground tracking-tight">
            Interpersonal <span className="text-primary italic">Dynamics</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyzing <strong>Parent</strong> vs <strong>Subject_Child</strong> (Simulated Profile)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-secondary/20 h-fit p-10 rounded-[48px] border border-border/50 shadow-sm">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" /> Temperament Overlap Map
            </h2>
            <ResultsChart 
              scores={parentResult.scores} 
              scores2={childScores} 
              label1="Parent" 
              label2="Child" 
            />
            <div className="flex justify-center gap-10 mt-10 text-[10px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center text-primary/80">
                <div className="w-2.5 h-2.5 bg-primary/70 rounded-full mr-2"></div> Parent
              </div>
              <div className="flex items-center text-accent/80">
                <div className="w-2.5 h-2.5 bg-accent/60 rounded-full mr-2"></div> Child
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {!aiAnalysis && !isAnalyzing ? (
              <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[48px] p-16 text-center space-y-8 h-full flex flex-col items-center justify-center">
                <BrainCircuit className="w-16 h-16 text-primary/20" />
                <div className="space-y-3">
                  <h2 className="text-2xl font-serif font-medium">Ready for Deep Synthesis?</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">Run the AI engine to uncover structural friction points and latent biological power dynamics.</p>
                </div>
                <Button onClick={handleAiAnalysis} size="lg" className="px-10 rounded-full">
                  Initialize AI Analysis
                </Button>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-muted/40 rounded-[40px] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <div className="bg-primary text-primary-foreground rounded-[40px] shadow-2xl p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                     <BrainCircuit className="w-24 h-24" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/40 mb-6">Executive Synthesis</h3>
                  <p className="text-xl font-light leading-relaxed italic relative z-10">"{aiAnalysis?.overview}"</p>
                </div>

                <section className="space-y-6">
                  <h2 className="text-2xl font-serif flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    Critical Friction Points
                  </h2>
                  <div className="grid gap-4">
                    {aiAnalysis?.frictionPoints.map((point, i) => (
                      <div key={i} className="border-l-4 border-l-primary bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-foreground leading-relaxed text-sm md:text-base font-medium">{point}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="bg-secondary/40 p-10 rounded-[40px] border border-border/50">
                    <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                        <Dna className="w-5 h-5" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Evolutionary Context</h3>
                    </div>
                    <p className="text-sm md:text-base leading-relaxed text-foreground/80 font-serif italic">
                        {aiAnalysis?.scientificContext}
                    </p>
                </div>

                <div className="space-y-6">
                   <h2 className="text-2xl font-serif">Containment Protocols</h2>
                   <div className="grid gap-3">
                     {aiAnalysis?.strategies.map((strat, i) => (
                       <div key={i} className="flex gap-6 p-6 rounded-2xl bg-muted/30 border border-border/30 text-sm">
                         <span className="font-bold text-primary font-mono text-lg">0{i+1}</span>
                         <p className="leading-relaxed">{strat}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}