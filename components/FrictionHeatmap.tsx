// FrictionHeatmap.tsx
import React from "react";
import { Profile, Domain } from "../types.ts";

interface FrictionHeatmapProps {
  profiles: Profile[];
}

export function FrictionHeatmap({ profiles }: FrictionHeatmapProps) {
  if (profiles.length < 2) return null;

  const domains: Domain[] = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];

  const getDivergenceColor = (gap: number) => {
    if (gap > 60) return "bg-red-500";
    if (gap > 40) return "bg-orange-400";
    if (gap > 20) return "bg-yellow-300";
    return "bg-slate-200";
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-border bg-muted/50 text-[10px] uppercase font-bold text-left">Trait Divergence</th>
            {profiles.map(p => (
              <th key={p.id} className="p-2 border border-border bg-muted/30 text-[10px] uppercase font-bold truncate max-w-[80px]">
                {p.name.split(' ')[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domains.map(domain => (
            <tr key={domain}>
              <td className="p-2 border border-border text-xs font-medium bg-muted/10">{domain}</td>
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
                  <td key={p.id} className="p-2 border border-border text-center">
                    <div 
                      className={`w-6 h-6 rounded-md mx-auto flex items-center justify-center text-[9px] font-bold ${getDivergenceColor(avgGap)}`}
                      title={`Avg divergence on ${domain}: ${Math.round(avgGap)}%`}
                    >
                      {Math.round(avgGap)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-4 text-[9px] uppercase font-bold text-muted-foreground">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-200 rounded-sm"></div> Harmony</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-300 rounded-sm"></div> Friction</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-sm"></div> Conflict</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> Clashing</div>
      </div>
    </div>
  );
}