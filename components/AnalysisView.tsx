import React, { useState } from 'react';
import { AuditResult, PricingTier } from '../types';
import { 
  CheckCircle, AlertTriangle, TrendingUp, Users, 
  Shield, Target, Search, Palette, MessageSquare 
} from 'lucide-react';

interface AnalysisViewProps {
  data: AuditResult;
  originalImage: string;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data, originalImage, onReset }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'redesign'>('audit');

  return (
    <div className="min-h-screen w-full pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">P</span>
            </div>
            <span className="font-bold text-lg text-slate-200">PricePerfect AI</span>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'audit' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Audit Report
            </button>
            <button 
              onClick={() => setActiveTab('redesign')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'redesign' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Proposed Redesign
            </button>
          </div>
          <button onClick={onReset} className="text-sm text-slate-400 hover:text-white">
            New Analysis
          </button>
        </div>
      </header>

      <main className="pt-24 max-w-7xl mx-auto px-6">
        {activeTab === 'audit' ? (
          <AuditDashboard data={data} image={originalImage} />
        ) : (
          <RedesignPreview data={data} />
        )}
      </main>
    </div>
  );
};

const AuditDashboard: React.FC<{ data: AuditResult; image: string }> = ({ data, image }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column: Visual Reference */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-slate-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4" /> Analyzed Asset
          </h3>
          <img src={image} alt="Original" className="w-full rounded-lg border border-slate-800 opacity-80" />
          <div className="mt-4 flex flex-wrap gap-2">
            {data.brand.colors.slice(0,5).map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full shadow-sm ring-1 ring-white/10" style={{ backgroundColor: color }}></div>
                <span className="text-[10px] text-slate-500 font-mono">{color}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Detected Brand Tone: <span className="text-slate-300">{data.brand.brandVoice}</span></p>
        </div>
      </div>

      {/* Right Column: Agent Reports */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          <ScoreCard title="CRO Score" score={data.croAudit.score} icon={<Target className="w-5 h-5 text-indigo-400" />} />
          <ScoreCard title="Usability Heuristics" score={data.heuristics.usabilityScore} icon={<Shield className="w-5 h-5 text-emerald-400" />} />
        </div>

        {/* Public Feedback Agent */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Public Feedback Agent
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
              ${data.publicFeedback.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 
                data.publicFeedback.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
              Sentiment: {data.publicFeedback.sentiment}
            </span>
          </div>
          <div className="space-y-3">
            {data.publicFeedback.simulatedReviews.map((review, i) => (
              <div key={i} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 flex gap-3">
                <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-300 italic">"{review}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor & CRO Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" /> Competitor Intel
              </h3>
              <p className="text-sm text-slate-400 mb-4">{data.competitorAnalysis.comparisonSummary}</p>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Missing Features</h4>
              <ul className="space-y-2">
                {data.competitorAnalysis.missingFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                     <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                     {feat}
                  </li>
                ))}
              </ul>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> CRO Tactics
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-emerald-500 uppercase mb-2">Doing Well</h4>
                  <ul className="space-y-1">
                    {data.croAudit.tacticsApplied.slice(0,3).map((t,i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-500 uppercase mb-2">Missed Opportunities</h4>
                  <ul className="space-y-1">
                    {data.croAudit.missedOpportunities.slice(0,3).map((t,i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

const ScoreCard: React.FC<{ title: string; score: number; icon: React.ReactNode }> = ({ title, score, icon }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
    <div>
      <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
        {icon} {title}
      </div>
      <div className="text-3xl font-bold text-white">{score}/100</div>
    </div>
    <div className="h-16 w-16 relative">
       <svg className="h-full w-full" viewBox="0 0 36 36">
          <path
            className="text-slate-800"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className={`${score > 70 ? 'text-emerald-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'}`}
            strokeDasharray={`${score}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
       </svg>
    </div>
  </div>
);

const RedesignPreview: React.FC<{ data: AuditResult }> = ({ data }) => {
  // Use brand color for accents, fallback to indigo if extraction fails or is too dark
  const primaryColor = data.brand.colors[0] || '#6366f1';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-6 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Redesign Strategy</h2>
        <p className="text-slate-300 max-w-3xl mx-auto">{data.redesign.reasoning}</p>
      </div>

      <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-2xl overflow-hidden text-slate-900">
        {/* Mock Browser Header */}
        <div className="w-full border-b border-slate-200 pb-8 mb-8 text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Simple, Transparent Pricing</h3>
            <p className="text-slate-500">Choose the plan that scales with your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {data.redesign.tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl
                ${tier.highlighted 
                  ? 'border-indigo-600 shadow-lg scale-105 z-10 bg-slate-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                  Most Popular
                </div>
              )}
              
              <h4 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h4>
              <p className="text-sm text-slate-500 mb-6 h-10">{tier.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-slate-500">/{tier.frequency}</span>}
              </div>

              <button 
                className={`w-full py-3 px-4 rounded-lg font-bold text-sm mb-8 transition-colors
                  ${tier.highlighted 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }
                `}
              >
                {tier.ctaText}
              </button>

              <ul className="space-y-3">
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center border-t border-slate-100 pt-8">
           <p className="text-slate-400 text-sm">Trusted by teams at Linear, Slack, and Notion.</p>
        </div>
      </div>
    </div>
  );
}
