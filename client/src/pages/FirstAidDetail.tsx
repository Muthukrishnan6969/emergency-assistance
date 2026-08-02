import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  AlertCircle, 
  ShieldCheck, 
  Share2, 
  CheckSquare,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import Header from '../components/Header';
import { getFallbackGuide, type GuideDetail } from '../data/fallbackGuides';

const FirstAidDetail: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  // Instant local lookup from offline dataset
  const fallback = category ? getFallbackGuide(category) : undefined;
  const [guide, setGuide] = useState<GuideDetail | null>(fallback || null);
  const [loading, setLoading] = useState(!fallback);
  const [error, setError] = useState(fallback ? '' : 'Loading guide...');
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});
  const [isLiveSync, setIsLiveSync] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchGuide = async () => {
      if (!category) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${apiUrl}/api/guides/${category}`, {
          timeout: 5000
        });
        if (isMounted && data) {
          setGuide(data);
          setIsLiveSync(true);
          setError('');
        }
      } catch (err) {
        // If we already have the fallback guide, no error needs to be shown to the user
        if (fallback) {
          console.warn('Backend asleep/offline, using offline guide.');
          if (isMounted) setError('');
        } else {
          if (isMounted) setError('Guide not found. Please select from the available guides.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGuide();
    return () => {
      isMounted = false;
    };
  }, [category, fallback]);

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = () => {
    if (!guide) return;
    const shareText = `Emergency First Aid for ${guide.title}:\n\nImmediate Actions:\n${guide.whatToDo.slice(0, 3).map((s, i) => `${i+1}. ${s}`).join('\n')}\n\nCall Emergency: ${guide.emergencyNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `Emergency First Aid: ${guide.title}`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <main className="container mx-auto px-4 max-w-3xl mt-6">
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/first-aid" 
            className="inline-flex items-center text-gray-700 hover:text-red-600 font-semibold text-sm transition-colors bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            All First Aid Guides
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center text-gray-700 hover:text-blue-600 text-xs font-semibold bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm"
              title="Share Guide"
            >
              <Share2 size={14} className="mr-1" />
              Share
            </button>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
              {isLiveSync ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isLiveSync ? 'Live' : 'Offline Ready'}
            </span>
          </div>
        </div>

        {loading && !guide ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
            <div className="h-40 bg-gray-100 rounded-xl mb-4"></div>
          </div>
        ) : error && !guide ? (
          <div className="bg-white border border-red-200 text-center p-8 rounded-2xl shadow-sm">
            <AlertCircle size={48} className="mx-auto mb-3 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Guide Not Found</h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <Link 
              to="/first-aid"
              className="inline-block bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors text-sm shadow"
            >
              Browse All Emergency Guides
            </Link>
          </div>
        ) : guide ? (
          <div className="space-y-6">
            {/* Hero Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-red-100">
                    <Sparkles size={12} /> Emergency Protocol
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{guide.title}</h1>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">{guide.description}</p>
                </div>

                <a 
                  href={`tel:${guide.emergencyNumber || '108'}`}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3.5 px-6 rounded-2xl font-bold shadow-lg shadow-red-500/25 transition-all active:scale-95 shrink-0"
                >
                  <PhoneCall size={20} className="animate-pulse" />
                  <span>Call {guide.emergencyNumber || '108'} Now</span>
                </a>
              </div>
            </div>

            {/* Symptoms Warning Box */}
            {guide.symptoms && guide.symptoms.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6 rounded-2xl">
                <h3 className="text-base font-bold text-amber-900 mb-3 flex items-center">
                  <AlertCircle className="text-amber-600 mr-2 shrink-0" size={20} />
                  Recognize the Warning Signs & Symptoms
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-amber-950">
                  {guide.symptoms.map((symptom, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                      <span className="text-amber-600 font-bold text-sm">•</span>
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Checklist / What To Do (DOs) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-extrabold text-emerald-900 flex items-center">
                  <CheckCircle2 className="text-emerald-600 mr-2.5 shrink-0" size={24} />
                  Step-by-Step Life Saving Actions (DOs)
                </h3>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Tap step to check off
                </span>
              </div>

              <div className="space-y-3">
                {guide.whatToDo.map((step, idx) => {
                  const isDone = completedSteps[idx];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleStep(idx)}
                      className={`cursor-pointer p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isDone 
                          ? 'bg-emerald-50/50 border-emerald-300 text-gray-500' 
                          : 'bg-emerald-50/20 hover:bg-emerald-50/60 border-emerald-100 text-gray-800'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckSquare className="text-emerald-600" size={20} />
                        ) : (
                          <div className="w-5 h-5 rounded-md border-2 border-emerald-400 flex items-center justify-center font-bold text-[11px] text-emerald-700">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <span className={`text-sm sm:text-base leading-relaxed ${isDone ? 'line-through' : 'font-medium'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What NOT To Do (DONTs) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-rose-100">
              <h3 className="text-lg sm:text-xl font-extrabold text-rose-900 mb-4 flex items-center">
                <XCircle className="text-rose-600 mr-2.5 shrink-0" size={24} />
                Critical Mistakes to Avoid (DONTs)
              </h3>
              
              <div className="space-y-3">
                {guide.whatNotToDo.map((item, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/40 border border-rose-100 flex items-start gap-3">
                    <span className="text-rose-600 font-extrabold text-base shrink-0 mt-0.5">✕</span>
                    <span className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Emergency Contacts Bar */}
            <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-600/30 text-red-400 rounded-2xl border border-red-500/30">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-base">Always prioritize professional medical care</h4>
                  <p className="text-xs text-gray-400">First aid is emergency stabilization while help is on the way.</p>
                </div>
              </div>
              <a 
                href="tel:112"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors w-full sm:w-auto text-center"
              >
                Dial National Emergency 112
              </a>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default FirstAidDetail;
