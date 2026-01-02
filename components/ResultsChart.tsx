// ResultsChart.tsx (dedicated component - keep this one as primary)
import React from "https://esm.sh/react@19";
import { DomainScore } from '../types.ts';

interface ResultsChartProps {
  scores: DomainScore[];
  scores2?: DomainScore[] | null;
  label1?: string;
  label2?: string;
}

export function ResultsChart({ scores, scores2, label1 = "Parent", label2 = "Child" }: ResultsChartProps) {
  return (
    <div className="space-y-6 py-4">
      {scores.map((s1, idx) => {
        const s2 = scores2 ? scores2[idx] : null;
        return (
          <div key={s1.domain} className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>{s1.domain}</span>
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
            {scores2 && (
              <div className="flex justify-center gap-10 mt-4 text-[10px] font-bold uppercase tracking-[0.2em]">
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
      })}
    </div>
  );
}