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
