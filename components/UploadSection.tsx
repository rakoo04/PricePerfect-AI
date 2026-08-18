import React, { useCallback, useState } from 'react';
import { Upload, ArrowRight, Image as ImageIcon, Zap } from 'lucide-react';

interface UploadSectionProps {
  onStartAnalysis: (file: File, competitors: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onStartAnalysis }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [competitors, setCompetitors] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
          Redesign your pricing page <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
             with AI Agents
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Get a comprehensive audit from our specialized agent team: CRO Expert, User Researcher, and Competitor Analyst.
        </p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div 
          className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 flex flex-col items-center justify-center gap-4
            ${dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:border-slate-600 bg-slate-800/30"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleChange}
            accept="image/*"
          />
          
          {selectedFile ? (
            <div className="flex flex-col items-center">
               <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className="h-32 w-auto object-contain rounded-lg shadow-lg mb-4 border border-slate-700"
               />
               <p className="text-slate-300 font-medium">{selectedFile.name}</p>
               <p className="text-slate-500 text-sm">Click to change</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-lg text-slate-300 font-medium">
                Drop your pricing page screenshot here
              </p>
              <p className="text-sm text-slate-500">
                Supports PNG, JPG, WEBP up to 10MB
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-left space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Competitors (Optional)
          </label>
          <input 
            type="text"
            placeholder="e.g. Slack, Linear, Asana (Helps the Competitor Agent)"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
          />
        </div>

        <button
          onClick={() => selectedFile && onStartAnalysis(selectedFile, competitors)}
          disabled={!selectedFile}
          className={`mt-8 w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
            ${selectedFile 
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transform hover:-translate-y-1" 
              : "bg-slate-800 text-slate-500 cursor-not-allowed"}
          `}
        >
          <Zap className="w-5 h-5" />
          Deploy Agent Team
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 text-left mt-12 opacity-60">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400" />
          <div>
            <h3 className="font-bold text-slate-300">Public Feedback Agent</h3>
            <p className="text-xs text-slate-500">Simulates user reviews & complaints</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
          <div>
            <h3 className="font-bold text-slate-300">Competitor Benchmark</h3>
            <p className="text-xs text-slate-500">Pricing model comparison</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
          <div>
            <h3 className="font-bold text-slate-300">CRO Audit</h3>
            <p className="text-xs text-slate-500">Heuristics & conversion tactics</p>
          </div>
        </div>
      </div>
    </div>
  );
};