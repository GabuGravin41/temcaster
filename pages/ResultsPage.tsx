// ResultsPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { TestResult, Profile } from "../types.ts";
import { TRAIT_DETAILS } from "../lib/content.ts";
import { encodeProfile, getProfiles, exportLibrary, importLibrary, getProfileById } from "../services/storage.ts";
import { ResultsChart } from "../components/ResultsChart.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { ArrowLeft, Users, ChevronRight, ChevronDown, Share2, Copy, Check, Download, Upload, AlertCircle } from "lucide-react";

export default function ResultsPage() {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileIdString, setProfileIdString] = useState("");

  useEffect(() => {
    // 1. If an ID is provided in the URL, prioritize that
    if (params.id) {
      const p = getProfileById(params.id);
      if (p) {
        setResult({
          answers: [],
          scores: p.scores,
          timestamp: p.timestamp,
          personName: p.name
        });
        return;
      }
    }

    // 2. Fallback to last test result
    const saved = localStorage.getItem("lastTestResult");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        console.error("Malformed lastTestResult", e);
      }
    } else {
      // 3. Last resort: just get the most recent profile in the library
      const profiles = getProfiles();
      if (profiles.length > 0) {
        const last = profiles[profiles.length - 1];
        setResult({
            answers: [],
            scores: last.scores,
            timestamp: last.timestamp,
            personName: last.name
        });
      } else {
        setLocation("/");
      }
    }
  }, [params.id, setLocation]);

  useEffect(() => {
    if (result) {
        const profiles = getProfiles();
        const profile = profiles.find(p => p.timestamp === result.timestamp) || {
            id: 'temp',
            name: result.personName,
            role: 'Friend',
            scores: result.scores,
            timestamp: result.timestamp
        } as Profile;
        setProfileIdString(encodeProfile(profile));
    }
  }, [result]);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      if (importLibrary(json)) {
        alert("Library imported successfully!");
        window.location.reload();
      } else {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground font-serif">Synthesizing Profile Data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link href="/compare">
            <Button variant="ghost" className="-ml-4 text-xs">
              <ArrowLeft className="mr-2 w-4 h-4" /> Return to Map
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full h-9 text-xs" onClick={() => setShowShare(!showShare)}>
                <Share2 className="mr-2 w-3 h-3" /> Share Code
            </Button>
            <Link href="/compare">
                <Button className="bg-primary text-white rounded-full h-9 text-xs group shadow-lg shadow-primary/10">
                <Users className="mr-2 w-3 h-3" /> Analyze Dynamics <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>
        </div>

        {showShare && (
            <div className="bg-card border border-border p-6 rounded-2xl shadow-lg animate-in slide-in-from-top-4">
                <h3 className="font-serif text-lg mb-2">Unique Character Code</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
                    Send this code to a friend for cross-referencing in their Lab.
                </p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        readOnly 
                        value={profileIdString} 
                        className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 text-[10px] font-mono text-muted-foreground truncate"
                    />
                    <Button onClick={() => {
                        navigator.clipboard.writeText(profileIdString);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }} variant="secondary" className="h-9 w-9 p-0">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        )}

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">Profile Synthesis: <span className="text-primary italic">{result.personName}</span></h1>
          <p className="text-lg text-muted-foreground">Psychometric mapping based on the 120-item IPIP-NEO inventory.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="border border-border/40 shadow-sm p-4 rounded-[40px] h-fit">
              <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Domain Intensity</CardTitle></CardHeader>
              <CardContent><ResultsChart scores={result.scores} /></CardContent>
            </Card>

            <div className="bg-secondary/30 rounded-[32px] p-6 space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lab Management</h3>
               <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="text-[10px] h-9" onClick={exportLibrary}>
                    <Download className="w-3 h-3 mr-2" /> Backup Lab
                  </Button>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImportFile}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="text-[10px] h-9 w-full">
                      <Upload className="w-3 h-3 mr-2" /> Restore Lab
                    </Button>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            {result.scores.map((score) => {
              const traitKey = score.domain.charAt(0);
              // CRITICAL FIX: Safe lookup with fallback to prevent crashes if key is missing
              const content = TRAIT_DETAILS[traitKey] || {
                title: score.domain,
                shortDesc: "Standard psychometric trait observation.",
                fullDesc: "This dimension measures core patterns of thought, feeling, and behavior.",
                facets: []
              };
              const isExpanded = expandedDomain === score.domain;

              return (
                <div key={score.domain} className={`space-y-4 transition-all duration-300 ${isExpanded ? 'bg-card p-6 rounded-[24px] border border-border shadow-sm' : ''}`}>
                  <div 
                    className="cursor-pointer group"
                    onClick={() => setExpandedDomain(isExpanded ? null : score.domain)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-serif font-bold text-lg group-hover:text-primary transition-colors">{score.domain}</h3>
                      <div className="flex items-center gap-3">
                         <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">{score.level} ({score.percentage}%)</span>
                         <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${score.percentage}%` }} 
                      />
                    </div>
                    {!isExpanded && (
                      <p className="text-[11px] text-muted-foreground italic line-clamp-1">
                         {content.shortDesc}
                      </p>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="animate-in fade-in slide-in-from-top-2 pt-2 space-y-4">
                      <p className="text-xs leading-relaxed text-foreground/80 border-l border-primary/20 pl-4">
                        {content.fullDesc}
                      </p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {content.facets && content.facets.length > 0 ? (
                          content.facets.map(f => (
                            <div key={f.name} className="flex gap-2 items-start text-[10px] leading-snug">
                              <span className="font-bold text-primary shrink-0">{f.name}:</span>
                              <span className="text-muted-foreground">{f.description}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground italic">
                            <AlertCircle className="w-3 h-3" /> Detailed facet data being processed...
                          </div>
                        )}
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