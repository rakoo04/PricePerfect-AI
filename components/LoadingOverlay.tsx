import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const steps = [
  "Initializing Agent Team...",
  "Brand Guardian: Extracting color palette & tone...",
  "Public Feedback Agent: Scanning for UX friction...",
  "Competitor Analyst: Benchmarking against market leaders...",
  "CRO Specialist: Applying conversion heuristics...",
  "Synthesizing Redesign...",
];

export const LoadingOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500); // Change step every 2.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-md space-y-8 p-8 text-center">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-2">
           <h2 className="text-2xl font-bold text-white">{steps[currentStep]}</h2>
           <p className="text-slate-500 text-sm">This process ensures a data-backed redesign.</p>
        </div>

        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-1000 ease-out" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 pt-4 opacity-50">
           {[0,1,2,3].map((i) => (
             <div key={i} className={`h-1 rounded-full transition-colors duration-500 ${i <= currentStep ? 'bg-indigo-500' : 'bg-slate-800'}`} />
           ))}
        </div>
      </div>
    </div>
  );
};