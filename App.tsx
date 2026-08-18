import React, { useState } from 'react';
import { AppState, AuditResult } from './types';
import { analyzePricingPage } from './services/geminiService';
import { UploadSection } from './components/UploadSection';
import { AnalysisView } from './components/AnalysisView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAnalysisStart = async (file: File, competitors: string) => {
    try {
      setState(AppState.ANALYZING);
      setErrorMessage('');
      
      // Convert file to base64 for display and API
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1]; // Remove data url prefix for API
        setOriginalImage(base64);
        
        try {
          const auditData = await analyzePricingPage(base64Data, competitors);
          setResult(auditData);
          setState(AppState.COMPLETE);
        } catch (error: any) {
          console.error(error);
          setErrorMessage(error?.message || "Unknown error");
          setState(AppState.ERROR);
        }
      };
    } catch (e: any) {
      setErrorMessage(e?.message || "Failed to read file");
      setState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {state === AppState.ANALYZING && <LoadingOverlay />}
      
      {state === AppState.IDLE && (
        <div className="min-h-screen flex flex-col">
           <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="font-bold text-white">P</span>
                </div>
                <span className="font-bold text-xl tracking-tight">PricePerfect AI</span>
             </div>
             <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">About the Agents</a>
           </header>
           
           <main className="flex-1 flex items-center justify-center p-6">
             <UploadSection onStartAnalysis={handleAnalysisStart} />
           </main>

           <footer className="p-6 text-center text-slate-600 text-sm">
             Powered by Gemini 2.5 Flash • Uses Nielsen Heuristics & CRO Best Practices
           </footer>
        </div>
      )}

      {state === AppState.COMPLETE && result && (
        <AnalysisView 
          data={result} 
          originalImage={originalImage} 
          onReset={() => setState(AppState.IDLE)} 
        />
      )}
      
      {state === AppState.ERROR && (
        <div className="min-h-screen flex items-center justify-center flex-col gap-6 p-4 text-center bg-slate-950">
           <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
             <AlertTriangle className="w-10 h-10 text-red-500" />
           </div>
           <div className="space-y-2">
             <h2 className="text-3xl font-bold text-white">Analysis Failed</h2>
             <p className="text-slate-400 max-w-md mx-auto">
               The agent team encountered an error while processing your request. 
               {errorMessage && <span className="block mt-2 text-xs font-mono bg-slate-900 p-2 rounded text-red-400">{errorMessage}</span>}
             </p>
           </div>
           <button 
             onClick={() => setState(AppState.IDLE)} 
             className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25"
           >
             <RefreshCw className="w-5 h-5" />
             Try Again
           </button>
        </div>
      )}
    </div>
  );
};

export default App;