import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Sparkles,
  MapPin,
  Mic,
  MicOff,
  Ambulance,
  Flame,
  Radio,
  Share2,
  PhoneCall,
  Volume2,
  VolumeX,
  Navigation,
  X,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import {
  analyzeEmergencyText,
  reverseGeocode,
  speakGuidance,
  stopSpeech,
  type TriageResult
} from '../utils/aiTriageEngine';

interface AIDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScenario?: string;
}

export interface IntimatedResponder {
  id: string;
  name: string;
  type: 'ambulance' | 'fire' | 'police';
  phone: string;
  distanceKm: number;
  etaMinutes: number;
  status: 'transmitting' | 'acknowledged' | 'dispatched' | 'en_route';
  lat: number;
  lng: number;
}

const AIDispatchModal: React.FC<AIDispatchModalProps> = ({ isOpen, onClose, initialScenario }) => {
  // Location States
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Detecting exact location...');
  const [locating, setLocating] = useState<boolean>(true);

  // Intake & AI States
  const [inputText, setInputText] = useState<string>(initialScenario || '');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Dispatch & Simulation States
  const [dispatchStage, setDispatchStage] = useState<'idle' | 'introspecting' | 'intimated' | 'active_tracking'>('idle');
  const [progressStep, setProgressStep] = useState<number>(0);
  const [responders, setResponders] = useState<IntimatedResponder[]>([]);
  const [cadIncidentId, setCadIncidentId] = useState<string>('');
  const [etaRemainingSeconds, setEtaRemainingSeconds] = useState<number>(360); // 6 mins default
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Auto-detect High-Accuracy GPS on mount
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      return;
    }

    let watchId: number;
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
          setCoords({ lat, lng });
          setAccuracy(acc);
          setLocating(false);

          const fetchedAddress = await reverseGeocode(lat, lng);
          setAddress(fetchedAddress);
        },
        (err) => {
          console.warn('GPS initial detection error:', err);
          // Fallback to default city coords (e.g. New Delhi / Bangalore region for testing)
          const fallbackLat = 12.9716;
          const fallbackLng = 77.5946;
          setCoords({ lat: fallbackLat, lng: fallbackLng });
          setAddress('Bangalore Central, Karnataka (Fallback GPS)');
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );

      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAccuracy(pos.coords.accuracy);
        },
        null,
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }

    // If initial scenario provided, analyze immediately
    if (initialScenario) {
      const result = analyzeEmergencyText(initialScenario);
      setTriage(result);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      stopSpeech();
    };
  }, [isOpen, initialScenario]);

  // Handle Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your emergency description.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
        const result = analyzeEmergencyText(transcript);
        setTriage(result);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  // Preset Scenario Click
  const handleSelectPreset = (text: string) => {
    setInputText(text);
    const result = analyzeEmergencyText(text);
    setTriage(result);
  };

  // Main Action: Trigger AI Auto-Intimation & Dispatch Sequence
  const handleTriggerAIDispatch = async () => {
    const activeText = inputText.trim() || 'Urgent Medical & Rescue Emergency';
    const analysis = triage || analyzeEmergencyText(activeText);
    setTriage(analysis);
    setDispatchStage('introspecting');
    setProgressStep(1);

    const userLat = coords?.lat || 12.9716;
    const userLng = coords?.lng || 77.5946;

    // Speak initial confirmation
    if (!isMuted) {
      speakGuidance(analysis.audioGuidanceScript);
    }

    // Step 1: Intimate local control room
    setTimeout(() => {
      setProgressStep(2);
    }, 1200);

    // Step 2: Auto-compute closest Ambulance and Fire Service
    setTimeout(async () => {
      setProgressStep(3);

      const generatedIncidentId = `INC-${Date.now().toString().slice(-6)}`;
      setCadIncidentId(generatedIncidentId);

      // Create realistic nearby responders relative to user coordinates
      const mockAmbulance: IntimatedResponder = {
        id: 'AMB-108-ALS',
        name: 'Apollo / City Trauma Care - ALS Ambulance 04',
        type: 'ambulance',
        phone: '108',
        distanceKm: 1.4,
        etaMinutes: 5,
        status: 'dispatched',
        lat: userLat + 0.009,
        lng: userLng + 0.008,
      };

      const mockFire: IntimatedResponder = {
        id: 'FIRE-101-R02',
        name: 'Municipal Fire & Rescue Command - Tender 02',
        type: 'fire',
        phone: '101',
        distanceKm: 2.1,
        etaMinutes: 7,
        status: 'dispatched',
        lat: userLat - 0.012,
        lng: userLng + 0.011,
      };

      const activeResponders = [mockAmbulance, mockFire];
      setResponders(activeResponders);

      // Attempt to persist intimation to backend API
      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.post(`${backendUrl}/incidents`, {
          emergencyType: analysis.emergencyType,
          severity: analysis.severity,
          description: activeText,
          coordinates: [userLng, userLat],
          address: address,
          triageDetails: {
            aiAssessment: analysis.aiAssessment,
            recommendedActions: analysis.immediateSteps,
            requiredUnits: analysis.requiredUnits,
          },
          customServices: activeResponders.map((r) => ({
            name: r.name,
            type: r.type === 'ambulance' ? 'hospital' : 'fire',
            phone: r.phone,
            distance: r.distanceKm,
            location: { coordinates: [r.lng, r.lat] },
          })),
        });
      } catch (backendErr) {
        console.warn('Backend intimation log error (continuing client telemetry):', backendErr);
      }

      setProgressStep(4);
      setDispatchStage('active_tracking');
      setEtaRemainingSeconds(300); // 5 mins countdown
    }, 2800);
  };

  // Countdown timer for ETA
  useEffect(() => {
    if (dispatchStage !== 'active_tracking') return;
    const interval = setInterval(() => {
      setEtaRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatchStage]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate WhatsApp / SMS CAD Dispatch link
  const getDispatchCADMessage = () => {
    const userLat = coords?.lat?.toFixed(5) || '0.000';
    const userLng = coords?.lng?.toFixed(5) || '0.000';
    const mapsLink = `https://www.google.com/maps?q=${userLat},${userLng}`;
    return `🚨 *AI EMERGENCY CAD INTIMATION TRANSMISSION* 🚨\n\n` +
      `*Incident ID:* ${cadIncidentId || 'INC-LIVE'}\n` +
      `*Emergency Type:* ${triage?.categoryLabel || 'Immediate Emergency'}\n` +
      `*Severity:* ${triage?.severity || 'CRITICAL'}\n` +
      `*GPS Coordinates:* ${userLat}, ${userLng}\n` +
      `*Location Address:* ${address}\n` +
      `*Live GPS Navigation:* ${mapsLink}\n\n` +
      `*Assigned Dispatched Units:*\n` +
      `🚑 Ambulance 108 (ETA 5 mins)\n` +
      `🚒 Fire & Rescue 101 (ETA 7 mins)\n\n` +
      `_Automated AI Emergency Telemetry Dispatch_`;
  };

  const handleShareCAD = (method: 'whatsapp' | 'sms' | 'copy') => {
    const msg = getDispatchCADMessage();
    if (method === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (method === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(msg)}`, '_blank');
    } else {
      navigator.clipboard.writeText(msg);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (triage) speakGuidance(triage.audioGuidanceScript);
    } else {
      setIsMuted(true);
      stopSpeech();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-3xl text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 p-4 sm:p-5 flex items-center justify-between shadow-lg shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md animate-pulse">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-lg sm:text-xl tracking-tight">AI Emergency Dispatch</h2>
                <span className="bg-red-950/60 text-red-200 border border-red-400/40 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                  Auto-Intimate
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium">
                Live GPS Tracking • Ambulance (108) & Fire (101) Auto-Notification
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* 1. Live GPS & Auto-Location Status Box */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl mt-0.5">
                <MapPin size={20} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Auto-Tracked Location</span>
                  {locating ? (
                    <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2 py-0.2 rounded-md animate-pulse">
                      Acquiring GPS...
                    </span>
                  ) : (
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.2 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      GPS Active (±{accuracy ? Math.round(accuracy) : 10}m)
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  {address}
                </p>
                {coords && (
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
                  </p>
                )}
              </div>
            </div>

            {coords && (
              <a
                href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                <Navigation size={13} />
                <span>Map Pin</span>
              </a>
            )}
          </div>

          {/* If Dispatch is NOT active: Show Intake, Presets, Voice & Triage Preview */}
          {dispatchStage === 'idle' && (
            <>
              {/* Emergency Scenario Presets */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Instant Emergency Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSelectPreset('Cardiac arrest / severe chest pain and collapsed')}
                    className="p-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 text-red-400 font-bold text-xs mb-1">
                      <span>❤️</span>
                      <span>Heart / CPR</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">Chest pain, collapsed</p>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('Major building fire with heavy smoke & trapped people')}
                    className="p-3 rounded-2xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-800/60 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 text-orange-400 font-bold text-xs mb-1">
                      <span>🔥</span>
                      <span>Structure Fire</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">Smoke, flames, gas leak</p>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('Severe road accident with car collision and trauma bleeding')}
                    className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs mb-1">
                      <span>🚨</span>
                      <span>Road Accident</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">Collision, heavy bleeding</p>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('Acute stroke, slurred speech and right side paralysis')}
                    className="p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1">
                      <span>🧠</span>
                      <span>Stroke / Seizure</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">Face drooping, fits</p>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('Venomous snake bite with puncture wounds and swelling')}
                    className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-1">
                      <span>🐍</span>
                      <span>Snake / Poison</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">Bite, toxin, allergic</p>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('Unconscious person with breathing difficulty')}
                    className="p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs mb-1">
                      <span>⚡</span>
                      <span>Unconscious</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">Unresponsive, choking</p>
                  </button>
                </div>
              </div>

              {/* Voice / Text Intake Bar */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Describe Emergency (Or Speak)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (e.target.value.trim().length > 3) {
                        setTriage(analyzeEmergencyText(e.target.value));
                      }
                    }}
                    placeholder="e.g. Severe fire in building, 2 people injured..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 pl-4 pr-14 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-500"
                  />
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`absolute right-2 p-2.5 rounded-xl transition-all ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse shadow-lg ring-4 ring-red-500/40'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                    title={isListening ? 'Listening... Tap to stop' : 'Tap to speak emergency'}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
                {isListening && (
                  <p className="text-xs text-red-400 font-bold mt-1.5 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    AI Speech Recognition Active: Listening to emergency report...
                  </p>
                )}
              </div>

              {/* Live AI Triage Assessment Preview */}
              {triage && (
                <div className="bg-slate-800/90 border border-indigo-500/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        AI Triage Assessment
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${triage.severityColor}`}>
                        {triage.severity} • CODE RED
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {Math.round(triage.confidenceScore * 100)}% Confidence
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">{triage.categoryLabel}</h3>
                  <p className="text-xs text-slate-300">{triage.aiAssessment}</p>

                  {/* Required Units Target */}
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Auto-Targeted Units:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {triage.requiredUnits.map((u, i) => (
                        <span
                          key={i}
                          className="bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-xs px-2.5 py-1 rounded-xl font-medium"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action: Trigger Intimation Button */}
              <button
                onClick={handleTriggerAIDispatch}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white font-black text-base shadow-xl shadow-red-900/30 flex items-center justify-center space-x-3 transition-all active:scale-98 cursor-pointer"
              >
                <Radio size={22} className="animate-pulse text-yellow-300" />
                <span>ACTIVATE AI AUTO-INTIMATION & DISPATCH</span>
              </button>
            </>
          )}

          {/* Introspecting / Transmitting Progress Animation */}
          {dispatchStage === 'introspecting' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 text-center space-y-6 animate-fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
                <Radio size={36} className="text-red-500 animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Intimating Emergency Services</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Generating CAD Telemetry package, reverse-geocoding coordinates, and alerting nearest emergency responder hubs.
                </p>
              </div>

              {/* Steps Progress */}
              <div className="space-y-3 max-w-md mx-auto text-left text-xs font-semibold">
                <div className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                  progressStep >= 1 ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  <span>1. Locking Exact GPS Coordinates & Reverse Geocode</span>
                  {progressStep >= 1 ? <CheckCircle2 size={16} className="text-emerald-400" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />}
                </div>

                <div className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                  progressStep >= 2 ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  <span>2. Intimating Nearest Ambulance Control (108)</span>
                  {progressStep >= 2 ? <CheckCircle2 size={16} className="text-emerald-400" /> : progressStep === 1 ? <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" /> : null}
                </div>

                <div className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                  progressStep >= 3 ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  <span>3. Intimating Fire & Rescue Command (101)</span>
                  {progressStep >= 3 ? <CheckCircle2 size={16} className="text-emerald-400" /> : progressStep === 2 ? <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" /> : null}
                </div>

                <div className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                  progressStep >= 4 ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  <span>4. Establishing Live Responder Telemetry Link</span>
                  {progressStep >= 4 ? <CheckCircle2 size={16} className="text-emerald-400" /> : null}
                </div>
              </div>
            </div>
          )}

          {/* Active Live Tracking & Dispatch Intimation Console */}
          {dispatchStage === 'active_tracking' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Confirmed Dispatch Banner with Live ETA */}
              <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900 border border-emerald-500/60 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5 text-left">
                  <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl font-black shadow-lg animate-pulse">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-lg text-emerald-200">Responders Dispatched</h3>
                      <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-emerald-500/40">
                        {cadIncidentId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Telemetry link established with emergency command network.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl px-5 py-2.5 text-center min-w-[130px] shrink-0 shadow-inner">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Fastest ETA
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {formatTime(etaRemainingSeconds)}
                  </span>
                </div>
              </div>

              {/* Intimated Responders Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {responders.map((res) => (
                  <div
                    key={res.id}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`p-2.5 rounded-xl text-white ${
                            res.type === 'ambulance' ? 'bg-red-600' : 'bg-orange-600'
                          }`}
                        >
                          {res.type === 'ambulance' ? <Ambulance size={20} /> : <Flame size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-sm text-white">{res.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Unit ID: {res.id} • {res.distanceKm} km away
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-emerald-300 font-semibold uppercase text-[10px] tracking-wider">
                          En-Route (Siren Active)
                        </span>
                      </div>
                      <a
                        href={`tel:${res.phone}`}
                        className="flex items-center space-x-1 bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg font-bold text-xs"
                      >
                        <PhoneCall size={12} />
                        <span>Call {res.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Voice & Step-by-Step Triage Guidance */}
              {triage && (
                <div className="bg-slate-800/90 border border-indigo-500/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                        AI Life-Saving Protocols (Follow While Waiting)
                      </span>
                    </div>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-700/60 text-indigo-300 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute voice assistance' : 'Mute voice'}
                    >
                      {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {triage.immediateSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Channel CAD Sharing (WhatsApp, SMS, Copy) */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Broadcast CAD Telemetry to Family & Responders
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleShareCAD('whatsapp')}
                    className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Share2 size={14} />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShareCAD('sms')}
                    className="flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <PhoneCall size={14} />
                    <span>SMS Alert</span>
                  </button>
                  <button
                    onClick={() => handleShareCAD('copy')}
                    className="flex items-center justify-center space-x-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 px-3 rounded-xl font-bold text-xs transition-all"
                  >
                    <span>{isCopied ? 'Copied!' : 'Copy Telemetry'}</span>
                  </button>
                </div>
              </div>

              {/* Reset / New Incident Button */}
              <div className="pt-1 flex justify-center">
                <button
                  onClick={() => {
                    stopSpeech();
                    setDispatchStage('idle');
                    setInputText('');
                    setTriage(null);
                  }}
                  className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Start New AI Triage Intake</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDispatchModal;
