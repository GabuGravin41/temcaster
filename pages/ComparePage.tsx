
// ComparePage.tsx
import React, { useEffect, useState } from "https://esm.sh/react@19";
import { Link, useLocation } from "https://esm.sh/wouter@3.9.0";
import { Profile, AnalysisResult } from "../types.ts";
import { getProfiles } from "../services/storage.ts";
import { analyzeRelationship } from "../services/geminiService.ts";
import { ResultsChart } from "../components/ResultsChart.tsx";
import { RadarChart } from "../components/RadarChart.tsx";
import { Button } from "../components/ui/button.tsx";
import { BrainCircuit, Loader2, ArrowLeft, Zap, Dna, Plus } from "https://esm.sh/lucide-react@0.562.0";

export default function ComparePage() {
  const [_, setLocation] = useLocation();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  // Selection State
  const [selectedIdA, setSelectedIdA] = useState<string>("");
  const [selectedIdB, setSelectedIdB] = useState<string>("");
  
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const loaded = getProfiles();
    setProfiles(loaded);
    
    // Auto-select first two if available
    if (loaded.length > 0) setSelectedIdA(loaded[0].id);
    if (loaded.length > 1) setSelectedIdB(loaded[1].id);
  }, []);

  const profileA = profiles.find(p => p.id === selectedIdA);
  const profileB = profiles.find(p => p.id === selectedIdB);

  const handleAiAnalysis = async () => {
    if (!profileA || !profileB) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeRelationship(
        { name: profileA.name, scores: profileA.scores },
        { name: profileB.name, scores: profileB.scores }
      );
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please check console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasEnoughProfiles = profiles.length >= 2;

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/results">
            <Button variant="ghost" className="-ml-4">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Results
            </Button>
          </Link>
          <Link href="/test">
            <Button variant="outline" className="rounded-full">
              <Plus className="mr-2 w-4 h-4" /> Add New Profile
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-foreground tracking-tight">
            Interpersonal <span className="text-primary italic">Dynamics</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Select two profiles to analyze compatibility friction points and power dynamics.
          </p>
        </div>

        {/* Profile Selectors */}
        {profiles.length < 2 ? (
           <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-2xl text-center">
             <h3 className="text-xl font-serif text-yellow-800 mb-2">Insufficient Data</h3>
             <p className="text-yellow-700 mb-4">You need at least two saved profiles to run a comparison.</p>
             <Link href="/test">
               <Button>Take Test & Save Profile</Button>
             </Link>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 bg-secondary/30 p-6 rounded-[32px] border border-border/50">
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-primary">Subject A (Base)</label>
               <select 
                 className="w-full p-3 rounded-xl border border-border bg-card"
                 value={selectedIdA}
                 onChange={(e) => {
                    setSelectedIdA(e.target.value);
                    setAiAnalysis(null);
                 }}
               >
                 {profiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-accent">Subject B (Comparison)</label>
               <select 
                 className="w-full p-3 rounded-xl border border-border bg-card"
                 value={selectedIdB}
                 onChange={(e) => {
                   setSelectedIdB(e.target.value);
                   setAiAnalysis(null);
                 }}
               >
                 {profiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
               </select>
            </div>
          </div>
        )}

        {profileA && profileB && (
          <div className="grid xl:grid-cols-2 gap-12">
            
            {/* Charts Column */}
            <div className="space-y-8">
              {/* Linear Chart */}
              <div className="bg-card p-8 rounded-[40px] border border-border shadow-sm">
                <h3 className="text-lg font-serif mb-4 text-muted-foreground">Linear Comparison</h3>
                <ResultsChart 
                  scores={profileA.scores} 
                  scores2={profileB.scores} 
                  label1={profileA.name} 
                  label2={profileB.name} 
                />
              </div>

              {/* Radar Chart */}
              <div className="bg-card p-8 rounded-[40px] border border-border shadow-sm flex flex-col items-center">
                <h3 className="text-lg font-serif mb-4 text-muted-foreground w-full text-left">Structural Shape</h3>
                <RadarChart 
                  scoresA={profileA.scores}
                  scoresB={profileB.scores}
                  labelA={profileA.name}
                  labelB={profileB.name}
                />
                <div className="flex justify-center gap-6 mt-4 text-xs font-bold uppercase tracking-widest">
                   <span className="text-primary flex items-center"><span className="w-3 h-3 bg-primary rounded-full mr-2"></span> {profileA.name}</span>
                   <span className="text-accent flex items-center"><span className="w-3 h-3 bg-accent rounded-full mr-2"></span> {profileB.name}</span>
                </div>
              </div>
            </div>

            {/* AI Analysis Column */}
            <div className="space-y-8">
              {!aiAnalysis && !isAnalyzing ? (
                <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[48px] p-16 text-center space-y-8 h-full flex flex-col items-center justify-center min-h-[400px]">
                  <BrainCircuit className="w-16 h-16 text-primary/20" />
                  <div className="space-y-3">
                    <h2 className="text-2xl font-serif font-medium">Ready for Deep Synthesis?</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Run the AI engine to uncover structural friction points between <span className="text-foreground font-semibold">{profileA.name}</span> and <span className="text-foreground font-semibold">{profileB.name}</span>.
                    </p>
                  </div>
                  <Button onClick={handleAiAnalysis} size="lg" className="px-10 rounded-full shadow-xl shadow-primary/20">
                    <BrainCircuit className="mr-2 w-5 h-5" /> Initialize AI Diagnosis
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
                    <Button 
                      variant="ghost" 
                      onClick={() => setAiAnalysis(null)} 
                      className="absolute bottom-6 right-6 text-primary-foreground/50 hover:text-white hover:bg-white/10"
                    >
                      Reset
                    </Button>
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
        )}
      </div>
    </div>
  );
}
