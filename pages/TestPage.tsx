// TestPage.tsx
import React, { useState } from "https://esm.sh/react@19";
import { useLocation } from "https://esm.sh/wouter@3.9.0";
import { getQuestions, calculateScores } from "../lib/scoring.ts";
import { Button } from "../components/ui/button.tsx";
import { ArrowLeft } from "https://esm.sh/lucide-react@0.562.0";
import { Answer } from "../types.ts";

export default function TestPage() {
  const [_, setLocation] = useLocation();
  const questions = getQuestions();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    const existingIdx = newAnswers.findIndex((a) => a.questionId === currentQuestion.id);
    
    if (existingIdx >= 0) {
      newAnswers[existingIdx] = { questionId: currentQuestion.id, value };
    } else {
      newAnswers.push({ questionId: currentQuestion.id, value });
    }
    
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
      }, 300);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const scores = calculateScores(answers);
    localStorage.setItem("lastTestResult", JSON.stringify({
      answers,
      scores,
      timestamp: Date.now(),
      personName: "Subject Alpha"
    }));

    setTimeout(() => {
      setLocation("/results");
    }, 800);
  };

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)?.value;
  const isComplete = answers.length === questions.length;

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 items-center justify-center animate-in fade-in duration-500">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <Button variant="ghost" onClick={() => setLocation("/")} className="p-0 h-auto">
            <ArrowLeft className="mr-2 w-4 h-4" /> Exit
          </Button>
          <span className="font-mono">Progress: {Math.round((answers.length / questions.length) * 100)}%</span>
        </div>

        <div className="bg-card border border-border/50 rounded-[40px] p-12 shadow-2xl text-center space-y-8">
          <div className="text-primary/30 font-mono text-[10px] tracking-widest">ITEM_{currentIdx + 1}</div>
          <h2 className="text-3xl font-serif leading-snug text-foreground">"{currentQuestion.text}"</h2>
          
          <div className="grid grid-cols-5 gap-4 py-8">
            {[1, 2, 3, 4, 5].map(val => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className={`w-12 h-12 rounded-full border-2 transition-all font-bold flex items-center justify-center cursor-pointer
                  ${currentAnswer === val ? 'bg-primary border-primary text-white scale-125' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
              >
                {val}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
            Previous
          </Button>
          {currentIdx === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!isComplete || isSubmitting} className="px-10">
              {isSubmitting ? "Synthesizing..." : "Finish Mapping"}
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setCurrentIdx(currentIdx + 1)} disabled={!currentAnswer}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}