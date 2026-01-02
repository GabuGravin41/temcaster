
// ResultsPage.tsx
import React, { useEffect, useState } from "https://esm.sh/react@19";
import { Link, useLocation } from "https://esm.sh/wouter@3.9.0";
import { TestResult, Profile } from "../types.ts";
import { TRAIT_DETAILS } from "../lib/content.ts";
import { encodeProfile, getProfiles } from "../services/storage.ts";
import { ResultsChart } from "../components/ResultsChart.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { ArrowLeft, Users, ChevronRight, ChevronDown, BookOpen, Share2, Copy, Check } from "https://esm.sh/lucide-react@0.562.0";

export default function ResultsPage() {
  const [_, setLocation] = useLocation();
  const [result, setResult] = useState<TestResult | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileIdString, setProfileIdString] = useState("");

  useEffect(() => {
    // Try to load from lastTestResult first
    const saved = localStorage.getItem("lastTestResult");
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      // If no last result, check if we have any profiles, default to the last one
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
  }, [setLocation]);

  useEffect(() => {
    if (result) {
        // Find the profile object to encode
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

  if (!result) return null;

  const toggleExpand = (domain: string) => {
    setExpandedDomain(expandedDomain === domain ? null : domain);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(profileIdString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" className="-ml-4">
              <ArrowLeft className="mr-2 w-4 h-4" /> Home
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => setShowShare(!showShare)}>
                <Share2 className="mr-2 w-4 h-4" /> Share Profile
            </Button>
            <Link href="/compare">
                <Button className="bg-primary text-white shadow-lg shadow-primary/20 rounded-full group">
                <Users className="mr-2 w-4 h-4" /> Run Dynamics Analysis <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>
        </div>

        {showShare && (
            <div className="bg-card border border-border p-6 rounded-2xl shadow-lg animate-in slide-in-from-top-4">
                <h3 className="font-serif text-lg mb-2">Share this Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Copy this code and send it to a friend. They can paste it in the "Compare" section to see how your personalities interact.
                </p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        readOnly 
                        value={profileIdString} 
                        className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 text-xs font-mono text-muted-foreground truncate"
                    />
                    <Button onClick={handleCopy} variant="secondary">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        )}

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">Psychometric Profile: <span className="text-primary italic">{result.personName}</span></h1>
          <p className="text-lg text-muted-foreground">Neural architecture summary based on the 120-question IPIP-NEO-PI-R scale.</p>
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
