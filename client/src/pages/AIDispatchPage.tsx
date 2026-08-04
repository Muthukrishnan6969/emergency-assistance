import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MapComponent, { type Service } from '../components/MapComponent';
import {
  Sparkles,
  MapPin,
  Mic,
  MicOff,
  Ambulance,
  Flame,
  ShieldAlert,
  Radio,
  Share2,
  PhoneCall,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Navigation,
  Activity,
  HeartPulse
} from 'lucide-react';
import {
  analyzeEmergencyText,
  reverseGeocode,
  speakGuidance,
  stopSpeech,
  type TriageResult
} from '../utils/aiTriageEngine';
import axios from 'axios';

const AIDispatchPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('Detecting your GPS location...');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

  // Intake & AI
  const [emergencyInput, setEmergencyInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Dispatch & Telemetry
  const [dispatchStatus, setDispatchStatus] = useState<'standby' | 'dispatching' | 'active'>('standby');
  const [incidentId, setIncidentId] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [countdown, setCountdown] = useState<number>(300); // 5 mins
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-acquire user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation([lat, lng]);
          setAccuracy(pos.coords.accuracy);
          setLoadingLocation(false);

          const fetchedAddr = await reverseGeocode(lat, lng);
          setAddress(fetchedAddr);

          // Populate initial nearby mock/real emergency units around this location
          generateNearbyServices(lat, lng);
        },
        (err) => {
          console.warn('Location detection fallback:', err);
          const fallbackLat = 12.9716;
          const fallbackLng = 77.5946;
          setUserLocation([fallbackLat, fallbackLng]);
          setAddress('Bangalore Central, Karnataka (Fallback GPS)');
          setLoadingLocation(false);
          generateNearbyServices(fallbackLat, fallbackLng);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    return () => {
      stopSpeech();
    };
  }, []);

  const generateNearbyServices = (lat: number, lng: number) => {
    const nearby: Service[] = [
      {
        _id: 'amb-1',
        name: 'Apollo Hospital & Emergency Trauma (ALS Ambulance)',
        type: 'hospital',
        phone: '108',
        address: 'Emergency Response Hub Sector 1',
        distance: 1.2,
        location: { coordinates: [lng + 0.007, lat + 0.006] },
      },
      {
        _id: 'fire-1',
        name: 'Central Fire & Rescue Brigade Station',
        type: 'fire',
        phone: '101',
        address: 'Fire Headquarters Sector 4',
        distance: 2.1,
        location: { coordinates: [lng - 0.009, lat + 0.008] },
      },
      {
        _id: 'police-1',
        name: 'City Police Incident Response Unit',
        type: 'police',
        phone: '100',
        address: 'Central Police Command',
        distance: 1.6,
        location: { coordinates: [lng + 0.005, lat - 0.007] },
      },
    ];
    setServices(nearby);
  };

  // Speech Recognition
  const toggleSpeech = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type the emergency details.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setEmergencyInput(transcript);
        setTriage(analyzeEmergencyText(transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.warn('Speech err:', err);
      setIsListening(false);
    }
  };

  const handlePresetSelect = (text: string) => {
    setEmergencyInput(text);
    setTriage(analyzeEmergencyText(text));
  };

  // Trigger automated intimation
  const handleActivateDispatch = async () => {
    const activeText = emergencyInput.trim() || 'Severe Medical & Rescue Emergency';
    const analysis = triage || analyzeEmergencyText(activeText);
    setTriage(analysis);
    setDispatchStatus('dispatching');

    if (!isMuted) {
      speakGuidance(analysis.audioGuidanceScript);
    }

    const genId = `INC-${Date.now().toString().slice(-6)}`;
    setIncidentId(genId);

    const lat = userLocation ? userLocation[0] : 12.9716;
    const lng = userLocation ? userLocation[1] : 77.5946;

    // Send intimation to backend
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${backendUrl}/incidents`, {
        emergencyType: analysis.emergencyType,
        severity: analysis.severity,
        description: activeText,
        coordinates: [lng, lat],
        address,
        triageDetails: {
          aiAssessment: analysis.aiAssessment,
          recommendedActions: analysis.immediateSteps,
          requiredUnits: analysis.requiredUnits,
        },
        customServices: services,
      });
    } catch (err) {
      console.warn('Incident log fallback:', err);
    }

    setTimeout(() => {
      setDispatchStatus('active');
      setCountdown(300);
    }, 2000);
  };

  // Countdown
  useEffect(() => {
    if (dispatchStatus !== 'active') return;
    const interval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatchStatus]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShareCAD = (method: 'whatsapp' | 'sms' | 'copy') => {
    const lat = userLocation ? userLocation[0].toFixed(5) : '0';
    const lng = userLocation ? userLocation[1].toFixed(5) : '0';
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const msg = `🚨 *AI EMERGENCY INTIMATION DISPATCH* 🚨\n\n` +
      `*Incident ID:* ${incidentId || 'INC-LIVE'}\n` +
      `*Emergency:* ${triage?.categoryLabel || 'Critical Emergency'}\n` +
      `*GPS Coordinates:* ${lat}, ${lng}\n` +
      `*Address:* ${address}\n` +
      `*Live Map:* ${mapsLink}\n\n` +
      `*Status:* 🚑 Ambulance & 🚒 Fire Service Intimated & En-Route!`;

    if (method === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (method === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(msg)}`, '_blank');
    } else {
      navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 sm:pb-12">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-indigo-800 rounded-3xl p-6 shadow-2xl border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-white/20 rounded-2xl backdrop-blur-md">
                <Sparkles size={24} className="text-yellow-300 animate-pulse" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Auto-Tracking & Emergency Intimation
              </h1>
            </div>
            <p className="text-sm text-red-100 font-medium max-w-xl">
              Continuously locks high-accuracy GPS coordinates, classifies emergencies with AI, and automatically transmits CAD dispatch alerts to the nearest Ambulance and Fire Brigade.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="tel:112"
              className="bg-red-950/80 hover:bg-red-900 border border-white/20 text-white font-black px-4 py-2.5 rounded-2xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <PhoneCall size={16} className="text-red-300 animate-pulse" />
              <span>Direct Hotline: 112</span>
            </a>
          </div>
        </div>

        {/* Live GPS Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <MapPin size={22} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Auto-Tracked Emergency Location
                </span>
                {loadingLocation ? (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full animate-pulse">
                    Detecting GPS...
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    GPS Locked (±{accuracy ? Math.round(accuracy) : 8}m)
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-white mt-0.5">{address}</p>
              {userLocation && (
                <p className="text-[11px] text-slate-400 font-mono">
                  Coordinates: {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                </p>
              )}
            </div>
          </div>

          {userLocation && (
            <a
              href={`https://www.google.com/maps?q=${userLocation[0]},${userLocation[1]}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
            >
              <Navigation size={14} />
              <span>Google Maps Pin</span>
            </a>
          )}
        </div>

        {/* 2-Column Grid: Left (Intake & Triage), Right (Map & Responders) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: AI Triage & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Presets */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                1-Tap Emergency Scenarios
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePresetSelect('Cardiac arrest, chest pain, collapsed')}
                  className="p-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-left transition-all"
                >
                  <div className="flex items-center space-x-1.5 text-red-400 font-bold text-xs mb-1">
                    <HeartPulse size={14} />
                    <span>Heart Attack</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Chest pain / CPR</p>
                </button>

                <button
                  onClick={() => handlePresetSelect('Severe building fire with trapped victims')}
                  className="p-3 rounded-2xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-800/60 text-left transition-all"
                >
                  <div className="flex items-center space-x-1.5 text-orange-400 font-bold text-xs mb-1">
                    <Flame size={14} />
                    <span>Structure Fire</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Smoke / Rescue</p>
                </button>

                <button
                  onClick={() => handlePresetSelect('Severe highway road accident with trauma bleeding')}
                  className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-left transition-all"
                >
                  <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-xs mb-1">
                    <Activity size={14} />
                    <span>Road Accident</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Collision / Trauma</p>
                </button>

                <button
                  onClick={() => handlePresetSelect('Venomous snake bite with puncture wounds and swelling')}
                  className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-left transition-all"
                >
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs mb-1">
                    <ShieldAlert size={14} />
                    <span>Snake Bite</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Venom / Allergy</p>
                </button>
              </div>
            </div>

            {/* Voice & Text Input */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Emergency Situation Description
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={emergencyInput}
                  onChange={(e) => {
                    setEmergencyInput(e.target.value);
                    if (e.target.value.trim().length > 3) {
                      setTriage(analyzeEmergencyText(e.target.value));
                    }
                  }}
                  placeholder="Type situation or tap microphone..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 pl-4 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-500"
                />
                <button
                  onClick={toggleSpeech}
                  className={`absolute right-2 p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse shadow-lg ring-4 ring-red-500/40'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                  title="Voice Recognition"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              </div>

              {/* Triage Preview */}
              {triage && (
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">AI Assessment</span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${triage.severityColor}`}>
                      {triage.severity} • RED
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{triage.categoryLabel}</h4>
                  <p className="text-xs text-slate-300">{triage.aiAssessment}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {triage.requiredUnits.map((u, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-950/90 border border-indigo-700/60 text-indigo-200 text-[11px] px-2 py-0.5 rounded-lg"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {dispatchStatus !== 'active' ? (
                <button
                  onClick={handleActivateDispatch}
                  disabled={dispatchStatus === 'dispatching'}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white font-black text-base shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Radio size={20} className="animate-pulse" />
                  <span>
                    {dispatchStatus === 'dispatching' ? 'Intimating Responders...' : 'TRANSMIT AI CAD DISPATCH'}
                  </span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-2xl p-4 text-center space-y-1">
                    <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-sm">
                      <CheckCircle2 size={18} />
                      <span>UNITS EN-ROUTE • FASTEST ETA</span>
                    </div>
                    <span className="text-3xl font-black text-emerald-300 font-mono block">
                      {formatCountdown(countdown)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleShareCAD('whatsapp')}
                      className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md"
                    >
                      <Share2 size={13} />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShareCAD('sms')}
                      className="py-2.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md"
                    >
                      <PhoneCall size={13} />
                      <span>SMS</span>
                    </button>
                    <button
                      onClick={() => handleShareCAD('copy')}
                      className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1 border border-slate-700 shadow-md"
                    >
                      <Share2 size={13} />
                      <span>{copied ? 'Copied!' : 'Copy CAD'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      stopSpeech();
                      setDispatchStatus('standby');
                      setEmergencyInput('');
                      setTriage(null);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center space-x-1 py-1"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Telemetry Session</span>
                  </button>
                </div>
              )}
            </div>

            {/* Life-Saving Audio Instructions */}
            {triage && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                    Immediate Life-Saving Instructions
                  </span>
                  <button
                    onClick={() => {
                      if (isMuted) {
                        setIsMuted(false);
                        speakGuidance(triage.audioGuidanceScript);
                      } else {
                        setIsMuted(true);
                        stopSpeech();
                      }
                    }}
                    className="p-1 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 hover:text-white"
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
                  </button>
                </div>

                <div className="space-y-2">
                  {triage.immediateSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Map & Intimated Services Matrix (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Map Display */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl overflow-hidden h-[340px] sm:h-[400px]">
              <MapComponent
                userLocation={userLocation}
                services={services}
              />
            </div>

            {/* Nearest Intimated Responders List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Targeted Emergency Responders
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {services.length} Units in 5km Zone
                </span>
              </div>

              <div className="space-y-2.5">
                {services.map((srv) => (
                  <div
                    key={srv._id}
                    className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2.5 rounded-xl text-white ${
                          srv.type === 'hospital'
                            ? 'bg-red-600'
                            : srv.type === 'fire'
                            ? 'bg-orange-600'
                            : 'bg-blue-600'
                        }`}
                      >
                        {srv.type === 'hospital' ? (
                          <Ambulance size={18} />
                        ) : srv.type === 'fire' ? (
                          <Flame size={18} />
                        ) : (
                          <ShieldAlert size={18} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">
                          {srv.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {srv.distance ? `${srv.distance.toFixed(1)} km away` : 'Nearby'} • {srv.address}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${srv.phone}`}
                      className="shrink-0 flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all"
                    >
                      <PhoneCall size={12} />
                      <span>{srv.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIDispatchPage;
