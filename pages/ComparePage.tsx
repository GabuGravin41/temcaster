// ComparePage.tsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Profile, AnalysisResult, ChatMessage } from "../types.ts";
import { getProfiles, decodeAndSaveProfile } from "../services/storage.ts";
import { analyzeRelationship, chatAboutProfiles } from "../services/geminiService.ts";
import { ResultsChart } from "../components/ResultsChart.tsx";
import { RadarChart } from "../components/RadarChart.tsx";
import { FrictionHeatmap } from "../components/FrictionHeatmap.tsx";
import { Button } from "../components/ui/button.tsx";
import { BrainCircuit, ArrowLeft, Plus, RefreshCw, Send, MessageSquare, Users, ExternalLink, Bookmark } from "lucide-react";

export default function ComparePage() {
  const [_, setLocation] = useLocation();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // UI State
  const [showImport, setShowImport] = useState(false);
  const [importString, setImportString] = useState("");
  
  // AI Logic
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Chat Logic
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userMsg, setUserMsg] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = getProfiles();
    setProfiles(loaded);
    if (loaded.length >= 2 && selectedIds.length === 0) {
      setSelectedIds([loaded[0].id, loaded[1].id]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const toggleSelection = (id: string) => {
    setAiAnalysis(null);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAiAnalysis = async () => {
    const selectedProfiles = profiles.filter(p => selectedIds.includes(p.id));
    if (selectedProfiles.length < 2) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeRelationship(selectedProfiles);
      setAiAnalysis(result);
    } catch (e: any) {
      console.error(e);
      setAnalysisError("Analysis failed. Please check your API key and connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim() || isChatting) return;
    const selectedProfiles = profiles.filter(p => selectedIds.includes(p.id));
    const msg = userMsg;
    setUserMsg("");
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setIsChatting(true);
    try {
      const reply = await chatAboutProfiles(selectedProfiles, chatHistory, msg);
      setChatHistory(prev => [...prev, { role: 'model', text: reply }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I can't process that right now." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const selectedProfiles = profiles.filter(p => selectedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/results">
            <Button variant="ghost" className="-ml-4">
              <ArrowLeft className="mr-2 w-4 h-4" /> Library
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full h-9 text-xs" onClick={() => setShowImport(!showImport)}>
                Import Profile
            </Button>
          </div>
        </div>

        {showImport && (
            <div className="bg-card border border-border p-6 rounded-2xl shadow-xl max-w-xl mx-auto animate-in slide-in-from-top-4">
                <h3 className="text-lg font-serif mb-2">Import Profile Code</h3>
                <textarea 
                    className="w-full h-24 bg-secondary/30 rounded-xl border border-border p-3 font-mono text-[10px] focus:ring-1 focus:ring-primary/50 outline-none resize-none mb-4"
                    placeholder="Paste character code..."
                    value={importString}
                    onChange={(e) => setImportString(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowImport(false)}>Cancel</Button>
                    <Button size="sm" onClick={() => {
                        if(decodeAndSaveProfile(importString)) {
                          setProfiles(getProfiles());
                          setShowImport(false);
                          setImportString("");
                        }
                    }}>Import</Button>
                </div>
            </div>
        )}

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">Family <span className="text-primary italic">Dynamics Map</span></h1>
          <p className="text-lg text-muted-foreground">Select two or more profiles to map compatibility, clusters, and friction zones.</p>
        </div>

        {/* Multi-Selection Pool */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => toggleSelection(p.id)}
              className={`p-3 rounded-2xl border transition-all text-left relative overflow-hidden ${selectedIds.includes(p.id) ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-inner shadow-primary/10' : 'border-border bg-card hover:border-primary/40'}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{p.role}</div>
              <div className="font-semibold text-xs truncate">{p.name}</div>
              {selectedIds.includes(p.id) && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
            </button>
          ))}
          <Link href="/test">
            <button className="p-3 rounded-2xl border border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 group h-full transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Add New</span>
            </button>
          </Link>
        </div>

        {selectedProfiles.length >= 2 ? (
          <div className="grid xl:grid-cols-12 gap-10">
            {/* Visual Analytics */}
            <div className="xl:col-span-7 space-y-10">
              <div className="bg-card border border-border/40 p-8 rounded-[40px] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Divergence Heatmap</h3>
                  <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-mono">N={selectedProfiles.length} Members</span>
                </div>
                <FrictionHeatmap profiles={selectedProfiles} />
              </div>

              {selectedProfiles.length === 2 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-card border border-border/40 p-6 rounded-[32px]">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Structural Symmetry</h3>
                    <RadarChart 
                      scoresA={selectedProfiles[0].scores}
                      scoresB={selectedProfiles[1].scores}
                    />
                  </div>
                  <div className="bg-card border border-border/40 p-6 rounded-[32px]">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Linear Overlap</h3>
                    <ResultsChart 
                      scores={selectedProfiles[0].scores}
                      scores2={selectedProfiles[1].scores}
                      label1={selectedProfiles[0].name.split(' ')[0]}
                      label2={selectedProfiles[1].name.split(' ')[0]}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/20 p-10 rounded-[40px] border border-dashed border-border text-center">
                  <div className="flex justify-center -space-x-4 mb-4">
                    {selectedProfiles.slice(0, 4).map((p, i) => (
                      <div key={p.id} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-background">
                        {p.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">Heatmap above displays the total emotional entropy for this group of {selectedProfiles.length}.</p>
                </div>
              )}
            </div>

            {/* AI Advisor Column */}
            <div className="xl:col-span-5 space-y-8">
              {/* Analysis Trigger */}
              {!aiAnalysis && (
                <Button 
                  onClick={handleAiAnalysis} 
                  disabled={isAnalyzing} 
                  className="w-full h-16 rounded-3xl shadow-xl shadow-primary/10 transition-all hover:translate-y-[-2px]"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" />
                      <span className="animate-pulse">Validating Dynamics...</span>
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="mr-2" />
                      {selectedProfiles.length > 2 ? `Analyze Group Clusters` : `Generate Conflict Analysis`}
                    </>
                  )}
                </Button>
              )}

              {analysisError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-xs flex items-center gap-2">
                  <Bookmark className="w-4 h-4 shrink-0" /> {analysisError}
                </div>
              )}

              {/* Analysis Results */}
              {aiAnalysis && (
                <div className="bg-primary text-primary-foreground p-8 rounded-[40px] shadow-2xl animate-in fade-in slide-in-from-bottom-4 space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/40">Lab Report: Scientific Synthesis</h3>
                    <Button variant="ghost" onClick={() => setAiAnalysis(null)} className="text-white/40 hover:text-white h-auto p-0 text-[10px] font-bold uppercase">Reset</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg font-serif italic leading-snug">"{aiAnalysis.overview}"</p>
                    
                    {aiAnalysis.groupDynamics && (
                       <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-xs leading-relaxed">
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-2">Group Dynamic Cluster</span>
                          {aiAnalysis.groupDynamics}
                       </div>
                    )}

                    <div className="space-y-2">
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Critical Friction Points</span>
                      {aiAnalysis.frictionPoints.map((fp, i) => (
                        <div key={i} className="bg-white/10 p-4 rounded-xl text-xs border border-white/5">{fp}</div>
                      ))}
                    </div>

                    <div className="pt-2">
                       <span className="block text-[9px] font-bold uppercase tracking-widest text-white/50 mb-2">Scientific Grounding</span>
                       <p className="text-[11px] leading-relaxed text-white/80">{aiAnalysis.scientificContext}</p>
                    </div>

                    {aiAnalysis.groundingSources && aiAnalysis.groundingSources.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {aiAnalysis.groundingSources.slice(0, 2).map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[9px] font-medium transition-colors border border-white/10"
                          >
                            <ExternalLink size={10} /> {source.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Interactive Relationship Advisor */}
              <div className="bg-slate-900 text-slate-100 rounded-[40px] flex flex-col h-[500px] shadow-2xl overflow-hidden border border-slate-800">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Interactive Advisor</span>
                  </div>
                  <Button variant="ghost" onClick={() => setChatHistory([])} className="h-6 text-[8px] uppercase tracking-widest text-slate-500 hover:text-white p-0">Clear Chat</Button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                  {chatHistory.length === 0 && (
                    <div className="text-center py-12 opacity-30 px-6">
                       <p className="text-xs">Chat with the lab advisor about these {selectedProfiles.length} personalities.</p>
                       <p className="text-[10px] mt-2 italic">"Who is most likely to cause tension in a high-stress environment?"</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-200'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isChatting && <div className="text-[10px] text-slate-500 animate-pulse ml-4">Thinking...</div>}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChat} className="p-4 bg-slate-800/50 border-t border-slate-800 flex gap-2">
                  <input 
                    type="text" 
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    placeholder="Ask a specific question..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none transition-shadow"
                  />
                  <button type="submit" className="bg-primary text-white p-2.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/10 border border-dashed border-border rounded-[48px] p-24 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-6 opacity-30" />
            <h2 className="text-2xl font-serif text-muted-foreground">Select at least two profiles from your library.</h2>
            <p className="text-sm text-muted-foreground mt-2 italic max-w-sm mx-auto">Compare multiple family members to see clusters and friction points.</p>
          </div>
        )}
      </div>
    </div>
  );
}