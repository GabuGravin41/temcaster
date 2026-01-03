// TestPage.tsx
import React, { useState } from "react";
import { useLocation } from "wouter";
import { getQuestions, calculateScores } from "../lib/scoring.ts";
import { saveProfile, generateId } from "../services/storage.ts";
import { Button } from "../components/ui/button.tsx";
import { ArrowLeft, Save, User, Users } from "lucide-react";
import { Answer, Profile } from "../types.ts";

export default function TestPage() {
  const [_, setLocation] = useLocation();
  const questions = getQuestions();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isDone, setIsDone] = useState(false);
  
  // Profile Form State
  const [profileType, setProfileType] = useState<'me' | 'other' | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Profile['role']>("Partner");
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
    
    const finalRole = profileType === 'me' ? 'Self' : role;
    
    const scores = calculateScores(answers);
    const newProfile: Profile = {
      id: generateId(),
      name: name,
      role: finalRole,
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
         <div className="max-w-lg w-full bg-card border border-border rounded-[32px] p-8 md:p-12 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif text-primary">Mapping Complete</h2>
              <p className="text-muted-foreground">Categorize this profile to add it to your library.</p>
            </div>

            {/* Step 1: Who is this? */}
            <div className="space-y-4">
               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center block">Who took this assessment?</label>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setProfileType('me'); setRole('Self'); }}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${profileType === 'me' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'}`}
                  >
                    <User className="w-8 h-8" />
                    <span className="font-semibold">I Did</span>
                  </button>
                  <button 
                    onClick={() => setProfileType('other')}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${profileType === 'other' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'}`}
                  >
                    <Users className="w-8 h-8" />
                    <span className="font-semibold">Someone Else</span>
                  </button>
               </div>
            </div>

            {/* Step 2: Details */}
            {profileType && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={profileType === 'me' ? "Enter your name" : "Enter their name"}
                    autoFocus
                  />
                </div>

                {profileType === 'other' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Relationship to You</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Partner', 'Child', 'Parent', 'Friend'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRole(r as any)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${role === r ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary/50 text-foreground hover:bg-secondary'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handleSaveProfile} disabled={!name || isSubmitting} className="w-full h-12 text-lg rounded-xl">
                  {isSubmitting ? "Saving..." : "Save Profile & View Results"} <Save className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
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