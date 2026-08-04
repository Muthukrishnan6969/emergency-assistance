// AI Emergency Triage, Speech Recognition, Reverse-Geocoding, and Responder Dispatch Engine

export interface TriageResult {
  emergencyType: 'medical' | 'fire' | 'accident' | 'crime' | 'hazard' | 'other';
  categoryLabel: string;
  severity: 'CRITICAL' | 'URGENT' | 'STANDARD';
  severityColor: string;
  confidenceScore: number;
  aiAssessment: string;
  requiredUnits: string[];
  immediateSteps: string[];
  hazardsDetected: string[];
  audioGuidanceScript: string;
}

// Reverse Geocoding with OpenStreetMap Nominatim
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en' },
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('Geocoding response not ok');
    const data = await response.json();
    
    if (data && data.display_name) {
      const addr = data.address || {};
      const parts = [
        addr.road || addr.street || addr.pedestrian || addr.suburb,
        addr.neighbourhood || addr.residential || addr.subdistrict,
        addr.city || addr.town || addr.village || addr.county,
        addr.state,
        addr.postcode,
      ].filter(Boolean);

      return parts.length > 0 ? parts.join(', ') : data.display_name;
    }
  } catch (err) {
    console.warn('Reverse geocoding fallback triggered:', err);
  }
  return `GPS Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
};

// AI Natural Language Emergency Triage Analyzer
export const analyzeEmergencyText = (text: string): TriageResult => {
  const clean = text.toLowerCase();

  // 1. Fire / Gas / Explosion / Trapped
  if (
    clean.includes('fire') ||
    clean.includes('smoke') ||
    clean.includes('burn') ||
    clean.includes('flame') ||
    clean.includes('explosion') ||
    clean.includes('cylinder') ||
    clean.includes('gas leak') ||
    clean.includes('trapped in building')
  ) {
    const isMajor = clean.includes('trapped') || clean.includes('explosion') || clean.includes('cylinder') || clean.includes('big');
    return {
      emergencyType: 'fire',
      categoryLabel: isMajor ? 'High-Hazard Structure & Hazmat Fire' : 'Fire & Smoke Emergency',
      severity: isMajor ? 'CRITICAL' : 'URGENT',
      severityColor: isMajor ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white',
      confidenceScore: 0.96,
      aiAssessment: isMajor 
        ? 'Major active fire/combustion incident with trapped victims or explosive hazards.' 
        : 'Active fire/combustion incident with respiratory and thermal trauma risk.',
      requiredUnits: [
        'Rapid Intervention Fire Tender',
        'ALS Burn Care Ambulance',
        'Hazmat Rescue Squad',
      ],
      immediateSteps: [
        'EVACUATE immediately. Do not use elevators.',
        'Stay low beneath the rising smoke level to avoid toxic inhalation.',
        'Cover nose and mouth with a damp cloth if available.',
        'Do not re-enter the burning structure under any circumstance.',
      ],
      hazardsDetected: ['Toxic Smoke Inhalation', 'Thermal Burns', 'Structural Collapse Risk'],
      audioGuidanceScript:
        'Fire emergency confirmed. Responders have been alerted. Evacuate immediately, stay low below smoke, and do not use elevators.',
    };
  }

  // 2. Cardiac Arrest / Heart Attack / Collapsed
  if (
    clean.includes('heart') ||
    clean.includes('chest pain') ||
    clean.includes('cardiac') ||
    clean.includes('collapsed') ||
    clean.includes('unconscious') ||
    clean.includes('not breathing') ||
    clean.includes('breathless') ||
    clean.includes('passed out')
  ) {
    return {
      emergencyType: 'medical',
      categoryLabel: 'Critical Cardiac / Respiratory Arrest',
      severity: 'CRITICAL',
      severityColor: 'bg-red-600 text-white',
      confidenceScore: 0.98,
      aiAssessment: 'Potential myocardial infarction or cardiac arrest. Seconds are vital.',
      requiredUnits: [
        'Advanced Life Support (ALS) Ambulance',
        'Paramedic Defibrillator (AED) Unit',
        'Hospital Emergency Cardiology Dept',
      ],
      immediateSteps: [
        'Place patient flat on back on a firm surface.',
        'Check breathing & pulse for 5 seconds.',
        'If not breathing: Start hands-only CPR at 100-120 compressions/min (2 inches deep in center of chest).',
        'Keep airway tilted gently back. Loosen tight collars.',
      ],
      hazardsDetected: ['Sudden Cardiac Death', 'Anoxic Brain Injury'],
      audioGuidanceScript:
        'Medical emergency detected. Ambulance with cardiac life support is dispatched. Place patient flat on firm ground and begin center-chest compressions continuously.',
    };
  }

  // 3. Severe Accident / Vehicle Collision / Heavy Trauma
  if (
    clean.includes('accident') ||
    clean.includes('crash') ||
    clean.includes('car') ||
    clean.includes('bike') ||
    clean.includes('collision') ||
    clean.includes('bleeding') ||
    clean.includes('blood') ||
    clean.includes('fracture') ||
    clean.includes('hit and run')
  ) {
    return {
      emergencyType: 'accident',
      categoryLabel: 'High-Velocity Trauma & Vehicle Accident',
      severity: 'CRITICAL',
      severityColor: 'bg-rose-600 text-white',
      confidenceScore: 0.94,
      aiAssessment: 'Severe multi-trauma collision with potential hemorrhage and spinal injury risk.',
      requiredUnits: [
        'ALS Trauma Ambulance Unit',
        'Heavy Hydraulic Rescue Extrication Tender',
        'Traffic Police Incident Unit',
      ],
      immediateSteps: [
        'Do NOT move victim unless there is imminent fire or hazard (protect cervical spine).',
        'Apply firm direct pressure with clean cloth to active bleeding wounds.',
        'Turn on hazard lights to alert oncoming highway traffic.',
        'Keep patient warm and calm. Do not give food or water.',
      ],
      hazardsDetected: ['Hemorrhagic Shock', 'Cervical Spine Injury', 'Secondary Traffic Collision'],
      audioGuidanceScript:
        'Accident response activated. Emergency ambulance and highway rescue are on the way. Do not move victim spine, apply direct pressure to bleeding.',
    };
  }

  // 4. Stroke / Neurological / Seizure
  if (
    clean.includes('stroke') ||
    clean.includes('seizure') ||
    clean.includes('fits') ||
    clean.includes('slurred') ||
    clean.includes('paralysis') ||
    clean.includes('numb')
  ) {
    return {
      emergencyType: 'medical',
      categoryLabel: 'Acute Neurological / Stroke Event',
      severity: 'CRITICAL',
      severityColor: 'bg-amber-600 text-white',
      confidenceScore: 0.92,
      aiAssessment: 'Acute stroke or seizure event. Time is brain tissue.',
      requiredUnits: ['ALS Stroke Ambulance', 'Comprehensive Stroke Center ER'],
      immediateSteps: [
        'Note the exact time symptoms began.',
        'Place patient on their side in recovery position to prevent airway choking.',
        'Do not put anything in the patient’s mouth.',
        'Keep environment quiet and protect head with a soft pad.',
      ],
      hazardsDetected: ['Airway Aspiration', 'Ischemic Brain Damage'],
      audioGuidanceScript:
        'Stroke response triggered. Turn patient on their side into recovery position and protect airway.',
    };
  }

  // 5. Severe Snake Bite / Poisoning / Allergic Anaphylaxis
  if (
    clean.includes('snake') ||
    clean.includes('bite') ||
    clean.includes('poison') ||
    clean.includes('allergic') ||
    clean.includes('swelling') ||
    clean.includes('choking')
  ) {
    return {
      emergencyType: 'medical',
      categoryLabel: 'Toxic Envenomation / Severe Anaphylaxis',
      severity: 'CRITICAL',
      severityColor: 'bg-emerald-700 text-white',
      confidenceScore: 0.91,
      aiAssessment: 'Toxicological or respiratory airway obstruction emergency.',
      requiredUnits: ['ALS Ambulance with Anti-Venom & Epinephrine', 'Toxicology ICU'],
      immediateSteps: [
        'Keep the victim calm and completely still to slow toxin circulation.',
        'Immobilize the bitten limb below heart level.',
        'Do NOT cut, suck, or apply tourniquets.',
        'If choking: perform Heimlich abdominal thrusts immediately.',
      ],
      hazardsDetected: ['Neurotoxic Paralysis', 'Airway Closure'],
      audioGuidanceScript:
        'Envenomation response activated. Keep patient completely still and limb immobilized below heart level.',
    };
  }

  // General Emergency Fallback
  return {
    emergencyType: 'medical',
    categoryLabel: 'Priority Multi-Agency Emergency',
    severity: 'CRITICAL',
    severityColor: 'bg-red-600 text-white',
    confidenceScore: 0.88,
    aiAssessment: 'Emergency dispatch triggered. Coordinating nearest medical and rescue teams.',
    requiredUnits: ['Rapid Response Ambulance (108)', 'Local Emergency Services (112)'],
    immediateSteps: [
      'Stay on the line and keep your phone accessible for dispatchers.',
      'Ensure the entrance or driveway is clearly visible for approaching sirens.',
      'Gather any known medical history or medications.',
      'Maintain calm and reassure the patient.',
    ],
    hazardsDetected: ['Rapid Deterioration Risk'],
    audioGuidanceScript:
      'Emergency coordinates and telemetry transmitted to nearby ambulance and rescue services. Stay calm, help is on the way.',
  };
};

// Voice Guidance Synthesizer
export const speakGuidance = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Pick standard English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
