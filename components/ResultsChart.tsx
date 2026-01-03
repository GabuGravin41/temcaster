// ResultsChart.tsx
import React, { useState } from "react";
import { DomainScore } from '../types.ts';
import { ChevronDown, ChevronRight, BarChart } from "lucide-react";

interface ResultsChartProps {
  scores: DomainScore[];
  scores2?: DomainScore[] | null;
  label1?: string;
  label2?: string;
}

export function ResultsChart({ scores, scores2, label1 = "Me", label2 = "Them" }: ResultsChartProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const toggleExpand = (domain: string) => {
    setExpandedDomain(expandedDomain === domain ? null : domain);
  };

  return (
    <div className="space-y-4 py-4 select-none">
      {scores.map((s1, idx) => {
        const s2 = scores2 ? scores2[idx] : null;
        const isExpanded = expandedDomain === s1.domain;

        return (
          <div key={s1.domain} className="space-y-2 group">
            {/* Main Domain Row */}
            <div 
                className="cursor-pointer space-y-2 p-2 hover:bg-secondary/20 rounded-xl transition-colors"
                onClick={() => toggleExpand(s1.domain)}
            >
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  <div className="flex items-center gap-1">
                     {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                     <span>{s1.domain}</span>
                  </div>
                  {isExpanded && <span className="text-xs normal-case bg-primary/10 px-2 rounded-full text-primary">Detailed Breakdown</span>}
                </div>
                
                <div className="relative h-4 w-full bg-secondary/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary/70 transition-all duration-700 ease-out z-10"
                    style={{ width: `${s1.percentage}%` }}
                  />
                  {s2 && (
                    <div 
                      className="absolute inset-y-0 left-0 bg-accent/60 transition-all duration-700 ease-out z-0"
                      style={{ width: `${s2.percentage}%` }}
                    />
                  )}
                </div>
            </div>

            {/* Expanded Facets View */}
            {isExpanded && (
                <div className="pl-4 pr-2 pb-4 pt-2 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300 border-l-2 border-primary/10 ml-2">
                    <div className="grid grid-cols-2 gap-4">
                        {s1.facets.map((f1, fIdx) => {
                            const f2 = s2?.facets[fIdx];
                            return (
                                <div key={f1.name} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-medium text-foreground/80">
                                        <span>{f1.name}</span>
                                        <span className="text-primary font-mono">{f1.percentage}%</span>
                                    </div>
                                    <div className="relative h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                                        <div 
                                            className="absolute inset-y-0 left-0 bg-primary/50 transition-all duration-500"
                                            style={{ width: `${f1.percentage}%` }}
                                        />
                                        {f2 && (
                                            <div 
                                                className="absolute inset-y-0 left-0 bg-accent/40 transition-all duration-500"
                                                style={{ width: `${f2.percentage}%` }}
                                            />
                                        )}
                                    </div>
                                    {f2 && (
                                         <div className="text-[9px] text-right text-accent font-mono">{f2.percentage}% (Comparison)</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
          </div>
        );
      })}

      {scores2 && (
        <div className="flex justify-center gap-10 mt-6 text-[10px] font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center text-primary/80">
            <div className="w-2.5 h-2.5 bg-primary/70 rounded-full mr-2"></div> {label1}
          </div>
          <div className="flex items-center text-accent/80">
            <div className="w-2.5 h-2.5 bg-accent/60 rounded-full mr-2"></div> {label2}
          </div>
        </div>
      )}
    </div>
  );
}