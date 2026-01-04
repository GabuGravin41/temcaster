// TestPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getQuestions, calculateScores } from "../lib/scoring.ts";
import { saveProfile, generateId, saveTestProgress, getTestProgress, clearTestProgress } from "../services/storage.ts";
import { Button } from "../components/ui/button.tsx";
import { ArrowLeft, Save, User, Users, RefreshCw, ShieldAlert } from "lucide-react";
import { Answer, Profile } from "../types.ts";
import { isAuthenticated } from "../services/authService.ts";

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

  useEffect(() => {
    const progress = getTestProgress();
    if (progress) {
      setCurrentIdx(progress.idx);
      setAnswers(progress.answers);
    }
  }, []);

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
    saveTestProgress(currentIdx, newAnswers);

    if (currentIdx < questions.length - 1) {
      setTimeout(() => {
        const next = currentIdx + 1;
        setCurrentIdx(next);
        saveTestProgress(next, newAnswers);
      }, 250);
    }
  };

  const handleComplete = () => {
    setIsDone(true);
    clearTestProgress();
  };

  const handleSaveProfile = () => {
    if (!name.trim()) return;
    
    // If not logged in, we MUST force signup to save data permanently
    if (!isAuthenticated()) {
      // Store temporary result to be "claimed" after login
      localStorage.setItem("pdl_pending_result", JSON.stringify({
        name,
        role: profileType === 'me' ? 'Self' : role,
        answers
      }));
      setLocation("/auth?claim=true");
      return;
    }

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

  const resetProgress = () => {
    if (confirm("Clear all progress and start over?")) {
      clearTestProgress();
      setAnswers([]);
      setCurrentIdx(0);
    }
  };

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)?.value;
  const isComplete = answers.length === questions.length;

  if (isDone) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in">
         <div className="max-w-lg w-full bg-card border border-border rounded-[32px] p-8 md:p-12 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif text-primary">Assessment Complete</h2>
              <p className="text-muted-foreground text-sm">Label this profile before saving.</p>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center block">Who is this profile for?</label>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setProfileType('me'); setRole('Self'); }}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${profileType === 'me' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'}`}
                  >
                    <User className="w-8 h-8" />
                    <span className="font-semibold text-sm">Me</span>
                  </button>
                  <button 
                    onClick={() => setProfileType('other')}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${profileType === 'other' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'}`}
                  >
                    <Users className="w-8 h-8" />
                    <span className="font-semibold text-sm">Someone Else</span>
                  </button>
               </div>
            </div>

            {profileType && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Identifying Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="e.g. David, Mom, Partner"
                    autoFocus
                  />
                </div>

                {profileType === 'other' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contextual Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Partner', 'Child', 'Parent', 'Friend'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRole(r as any)}
                          className={`p-2.5 rounded-xl text-xs font-medium transition-all ${role === r ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary/50 text-foreground hover:bg-secondary'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 items-start">
                   <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-amber-800 leading-normal">
                     Note: To comply with dynamic laboratory privacy standards, results are only visible within a <strong>Private Vault</strong>. You will be asked to sign in/up to decrypt your report.
                   </p>
                </div>

                <Button onClick={handleSaveProfile} disabled={!name || isSubmitting} className="w-full h-12 text-md rounded-xl shadow-lg">
                  {isSubmitting ? "Processing..." : "Finish and Analyze"} <Save className="ml-2 w-4 h-4" />
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
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={resetProgress} className="p-0 h-auto text-red-500/60 hover:text-red-500">
                <RefreshCw className="mr-2 w-3 h-3" /> Restart
             </Button>
             <span className="font-mono text-primary">{Math.round((answers.length / questions.length) * 100)}% Complete</span>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-[40px] p-12 shadow-2xl text-center space-y-10">
          <div className="text-primary/40 font-mono text-[9px] tracking-widest uppercase">Psychometric Inventory — Item {currentIdx + 1} of {questions.length}</div>
          <h2 className="text-3xl font-serif leading-snug text-foreground min-h-[120px] flex items-center justify-center italic">"{currentQuestion.text}"</h2>
          
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => handleAnswer(val)}
                  className={`w-14 h-14 rounded-full border-2 transition-all font-mono text-lg flex items-center justify-center cursor-pointer
                    ${currentAnswer === val ? 'bg-primary border-primary text-white scale-110 shadow-lg' : 'bg-background border-border text-muted-foreground hover:border-primary/30'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2">
              <span>Strongly Disagree</span>
              <span>Neutral</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4">
          <Button variant="ghost" className="text-xs" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
            ← Previous Question
          </Button>
          {currentIdx === questions.length - 1 ? (
            <Button onClick={handleComplete} disabled={!isComplete} className="px-10 rounded-full shadow-md">
              Complete Assessment
            </Button>
          ) : (
            <Button variant="secondary" className="text-xs" onClick={() => setCurrentIdx(currentIdx + 1)} disabled={!currentAnswer}>
              Next Question →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}