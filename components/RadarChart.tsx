// RadarChart.tsx
import React from "react";
import { DomainScore } from '../types.ts';

interface RadarChartProps {
  scoresA: DomainScore[];
  scoresB?: DomainScore[];
  labelA?: string;
  labelB?: string;
}

export function RadarChart({ scoresA, scoresB, labelA, labelB }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const domains = ['O', 'C', 'E', 'A', 'N'];
  
  // Helper to calculate coordinates
  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2; // Start at top
    // Map 0-100 score to radius
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getPath = (scores: DomainScore[]) => {
    // Ensure scores are mapped to OCEAN order for consistency
    const sortedPercentages = domains.map(d => {
      const found = scores.find(s => s.domain.startsWith(d));
      return found ? found.percentage : 0;
    });
    
    return sortedPercentages.map((p, i) => {
      const { x, y } = getCoordinates(p, i);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  // Axis lines
  const axes = domains.map((d, i) => {
    const { x, y } = getCoordinates(100, i);
    return (
      <g key={d}>
        <line x1={center} y1={center} x2={x} y2={y} stroke="hsl(var(--border))" strokeDasharray="4 4" />
        <text 
          x={x + (x - center) * 0.2} 
          y={y + (y - center) * 0.2} 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-[10px] font-bold fill-muted-foreground"
        >
          {d}
        </text>
      </g>
    );
  });

  return (
    <div className="flex justify-center items-center py-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grid */}
        {[20, 40, 60, 80, 100].map(r => (
           <circle key={r} cx={center} cy={center} r={(r/100)*radius} fill="none" stroke="hsl(var(--border))" opacity={0.3} />
        ))}
        {axes}

        {/* Profile A */}
        <path 
          d={getPath(scoresA)} 
          fill="hsl(var(--primary))" 
          fillOpacity="0.3" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2" 
        />
        
        {/* Profile B */}
        {scoresB && (
          <path 
            d={getPath(scoresB)} 
            fill="hsl(var(--accent))" 
            fillOpacity="0.3" 
            stroke="hsl(var(--accent))" 
            strokeWidth="2" 
          />
        )}
      </svg>
    </div>
  );
}