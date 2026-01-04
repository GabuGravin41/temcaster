// FrictionHeatmap.tsx
import React from "react";
import { Profile, Domain } from "../types.ts";
import { Info } from "lucide-react";

interface FrictionHeatmapProps {
  profiles: Profile[];
}

export function FrictionHeatmap({ profiles }: FrictionHeatmapProps) {
  if (profiles.length < 2) return null;

  const domains: Domain[] = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];

  const getDivergenceColor = (gap: number) => {
    if (gap > 60) return "bg-red-500 text-white";
    if (gap > 40) return "bg-orange-400 text-white";
    if (gap > 20) return "bg-yellow-300 text-black";
    return "bg-slate-200 text-slate-600";
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3 border border-primary/10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Understanding Distance</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            The numbers in the grid represent the <strong>Percentage Gap</strong> between an individual and the group average. 
            Higher numbers (Yellow/Red) indicate a "Divergent" or outlier temperament for that trait compared to other members.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto w-full rounded-2xl border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 bg-muted/50 text-[10px] uppercase font-bold text-left border-b border-r border-border min-w-[140px]">
                Distance From Group
              </th>
              {profiles.map(p => (
                <th key={p.id} className="p-3 bg-muted/30 text-[10px] uppercase font-bold text-center border-b border-border">
                  <div className="truncate max-w-[80px] mx-auto">{p.name.split(' ')[0]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domains.map(domain => (
              <tr key={domain} className="hover:bg-muted/5 transition-colors">
                <td className="p-3 text-xs font-semibold border-r border-border">{domain}</td>
                {profiles.map(p => {
                  const score = p.scores.find(s => s.domain === domain)?.percentage || 0;
                  // Calculate average gap from this person to all others
                  const totalGap = profiles.reduce((acc, other) => {
                    if (p.id === other.id) return acc;
                    const otherScore = other.scores.find(s => s.domain === domain)?.percentage || 0;
                    return acc + Math.abs(score - otherScore);
                  }, 0);
                  const avgGap = totalGap / (profiles.length - 1);

                  return (
                    <td key={p.id} className="p-3 text-center">
                      <div 
                        className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-110 cursor-default ${getDivergenceColor(avgGap)}`}
                        title={`${p.name}'s avg difference on ${domain}: ${Math.round(avgGap)}%`}
                      >
                        {Math.round(avgGap)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-wrap gap-4 px-2 py-1 text-[9px] uppercase font-bold text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></div> Harmony (&lt;20%)</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-yellow-300 rounded-sm"></div> Minor Gap</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-orange-400 rounded-sm"></div> Significant Gap</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div> Major Divergence</div>
      </div>
    </div>
  );
}