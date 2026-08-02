import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Activity, 
  AlertTriangle, 
  Flame, 
  Zap, 
  Droplets, 
  Mountain, 
  Search, 
  HeartPulse, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';
import Header from '../components/Header';
import { FALLBACK_GUIDES, type GuideDetail } from '../data/fallbackGuides';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'road-accident': 
      return <AlertTriangle className="text-amber-500" size={28} />;
    case 'heart-attack': 
      return <Activity className="text-red-500" size={28} />;
    case 'burns': 
      return <Flame className="text-orange-500" size={28} />;
    case 'snake-bite': 
      return <ShieldAlert className="text-emerald-600" size={28} />;
    case 'electric-shock': 
      return <Zap className="text-yellow-500" size={28} />;
    case 'choking': 
      return <HeartPulse className="text-purple-500" size={28} />;
    case 'severe-bleeding': 
      return <Activity className="text-rose-600" size={28} />;
    case 'stroke': 
      return <Clock className="text-indigo-500" size={28} />;
    case 'flood': 
      return <Droplets className="text-blue-500" size={28} />;
    case 'earthquake': 
      return <Mountain className="text-amber-700" size={28} />;
    default: 
      return <BookOpen className="text-red-600" size={28} />;
  }
};

const FirstAidList: React.FC = () => {
  // Initialize immediately with instant offline dataset — zero skeleton freeze!
  const [guides, setGuides] = useState<GuideDetail[]>(FALLBACK_GUIDES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isOnlineData, setIsOnlineData] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchGuides = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${apiUrl}/api/guides`, {
          timeout: 6000 // Short 6-second timeout so it never hangs indefinitely
        });
        
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Merge server guides with fallback guides to ensure comprehensive coverage
          const serverCategories = new Set(data.map((g: any) => g.category));
          const nonDuplicatedFallbacks = FALLBACK_GUIDES.filter(
            fg => !serverCategories.has(fg.category)
          );
          setGuides([...data, ...nonDuplicatedFallbacks]);
          setIsOnlineData(true);
        }
      } catch (err) {
        // Fallback is already actively rendered, silent graceful fallback
        console.warn('Backend sleeping or offline, using offline first aid guides.');
      }
    };

    fetchGuides();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.symptoms?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTag === 'critical') {
      return guide.severity === 'critical';
    }
    if (selectedTag === 'medical') {
      return ['heart-attack', 'stroke', 'choking', 'severe-bleeding'].includes(guide.category);
    }
    if (selectedTag === 'injury') {
      return ['road-accident', 'burns', 'snake-bite', 'electric-shock'].includes(guide.category);
    }
    if (selectedTag === 'disaster') {
      return ['flood', 'earthquake'].includes(guide.category);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <main className="container mx-auto px-4 max-w-4xl mt-6">
        {/* Banner with instant offline badge */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} /> Emergency Protocols
                </span>
                <span className="bg-emerald-500/30 text-emerald-100 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400/30">
                  {isOnlineData ? <Wifi size={12} /> : <WifiOff size={12} />}
                  {isOnlineData ? 'Live Sync' : 'Instant Offline Ready'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">First Aid Guides</h2>
              <p className="text-red-100 text-sm sm:text-base mt-1 max-w-xl">
                Quick, life-saving instructions for critical emergencies. In any life-threatening situation, dial emergency services immediately.
              </p>
            </div>

            <div className="flex sm:flex-col gap-2">
              <a 
                href="tel:108"
                className="flex items-center justify-center space-x-2 bg-white text-red-600 font-bold px-4 py-2.5 rounded-xl shadow hover:bg-red-50 transition-all active:scale-95 text-sm"
              >
                <PhoneCall size={16} />
                <span>Call 108</span>
              </a>
              <a 
                href="tel:112"
                className="flex items-center justify-center space-x-2 bg-red-800 text-white font-bold px-4 py-2.5 rounded-xl shadow hover:bg-red-900 transition-all active:scale-95 text-sm"
              >
                <PhoneCall size={16} />
                <span>Call 112</span>
              </a>
            </div>
          </div>
        </div>

        {/* Search & Fast Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search emergency (e.g. heart attack, snake bite, burn, choking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar">
            {[
              { id: 'all', label: 'All Guides' },
              { id: 'critical', label: '🚨 Critical' },
              { id: 'medical', label: '❤️ Medical' },
              { id: 'injury', label: '🩹 Accidents & Trauma' },
              { id: 'disaster', label: '🌊 Natural Disasters' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTag(tab.id)}
                className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedTag === tab.id 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid — rendered instantly without skeletons */}
        {filteredGuides.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
            <AlertTriangle className="text-amber-500 mx-auto mb-3" size={40} />
            <h3 className="text-lg font-bold text-gray-800 mb-1">No matching emergency guides</h3>
            <p className="text-sm text-gray-500 mb-4">Try clearing your search or selecting another category.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag('all'); }}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
            >
              Show All Guides
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuides.map((guide) => (
              <Link 
                key={guide._id || guide.category} 
                to={`/first-aid/${guide.category}`}
                className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-red-200 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-red-50 flex items-center justify-center transition-colors border border-gray-100">
                      {getCategoryIcon(guide.category)}
                    </div>
                    {guide.severity === 'critical' && (
                      <span className="bg-red-100 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Critical
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-red-600 transition-colors mb-1">
                    {guide.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-red-600">
                  <span>View Step-by-Step Guide →</span>
                  <span className="text-gray-400 font-normal">Dial {guide.emergencyNumber || '108'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FirstAidList;
