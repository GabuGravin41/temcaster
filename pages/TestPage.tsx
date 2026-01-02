
// TestPage.tsx
import React, { useState } from "https://esm.sh/react@19";
import { useLocation } from "https://esm.sh/wouter@3.9.0";
import { getQuestions, calculateScores } from "../lib/scoring.ts";
import { saveProfile, generateId } from "../services/storage.ts";
import { Button } from "../components/ui/button.tsx";
import { ArrowLeft, Save } from "https://esm.sh/lucide-react@0.562.0";
import { Answer, Profile } from "../types.ts";

export default function TestPage() {
  const [_, setLocation] = useLocation();
  const questions = getQuestions();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isDone, setIsDone] = useState(false);
  
  // Profile Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState<Profile['role']>("Parent");
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

  const handleComplete = () => {
    setIsDone(true);
  };

  const handleSaveProfile = () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    
    const scores = calculateScores(answers);
    const newProfile: Profile = {
      id: generateId(),
      name: name,
      role: role,
      scores: scores,
      timestamp: Date.now()
    };

    saveProfile(newProfile);

    // Save as "last result" for immediate viewing on ResultsPage
    localStorage.setItem("lastTestResult", JSON.stringify({
      answers,
      scores,
      timestamp: Date.now(),
      personName: name
    }));

    setTimeout(() => {
      setLocation("/results");
    }, 800);
  };

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)?.value;
  const isComplete = answers.length === questions.length;

  if (isDone) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in">
         <div className="max-w-md w-full bg-card border border-border rounded-[32px] p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif text-primary">Mapping Complete</h2>
              <p className="text-muted-foreground">Save this profile to your family library to enable dynamics analysis.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name / Alias</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/30 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. John, Mom, Partner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Parent', 'Child', 'Partner', 'Friend'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r as any)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${role === r ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-foreground hover:bg-secondary'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={handleSaveProfile} disabled={!name || isSubmitting} className="w-full h-12 text-lg">
              {isSubmitting ? "Saving..." : "Save Profile & View Results"} <Save className="ml-2 w-4 h-4" />
            </Button>
         </div>
      </div>
    );
  }

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
            <Button onClick={handleComplete} disabled={!isComplete} className="px-10">
              Complete Assessment
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
