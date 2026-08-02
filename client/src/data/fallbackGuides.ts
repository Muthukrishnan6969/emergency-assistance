export interface GuideDetail {
  _id: string;
  category: string;
  title: string;
  description: string;
  symptoms: string[];
  whatToDo: string[];
  whatNotToDo: string[];
  emergencyNumber: string;
  severity?: 'critical' | 'high' | 'medium';
}

export const FALLBACK_GUIDES: GuideDetail[] = [
  {
    _id: 'guide-road-accident',
    category: 'road-accident',
    title: 'Road Accident',
    description: 'First aid and emergency protocol for road traffic accident victims.',
    severity: 'critical',
    emergencyNumber: '108',
    symptoms: [
      'Visible bleeding or lacerations',
      'Unconsciousness or confusion',
      'Difficulty breathing or chest pain',
      'Visible bone fractures or inability to move limbs',
      'Shock (pale, cold, clammy skin, rapid pulse)'
    ],
    whatToDo: [
      'Ensure the scene is safe before approaching (turn on hazard lights, watch for traffic).',
      'Call 108 / 112 emergency services immediately.',
      'Check responsiveness and airway. If unconscious and not breathing, begin CPR.',
      'Apply direct firm pressure to any bleeding wounds using a clean cloth or bandage.',
      'Keep the victim calm, warm, and still until paramedics arrive.',
      'If vomiting, turn them gently onto their side (recovery position) supporting the neck.'
    ],
    whatNotToDo: [
      'Do NOT move the victim unless there is imminent danger (fire, explosion).',
      'Do NOT remove a helmet from an injured motorcyclist (may worsen spinal trauma).',
      'Do NOT give food, water, or medication to the victim.',
      'Do NOT remove penetrating objects stuck in wounds.'
    ]
  },
  {
    _id: 'guide-heart-attack',
    category: 'heart-attack',
    title: 'Heart Attack',
    description: 'Immediate life-saving response when someone suffers a suspected heart attack or cardiac arrest.',
    severity: 'critical',
    emergencyNumber: '108',
    symptoms: [
      'Crushing chest pain, pressure, tightness, or aching in the center of the chest',
      'Pain spreading to left arm, shoulder, neck, jaw, back, or upper stomach',
      'Shortness of breath or gasping for air',
      'Cold sweat, extreme dizziness, lightheadedness, or nausea',
      'Sudden collapse or loss of pulse'
    ],
    whatToDo: [
      'Call emergency medical services (108 / 112) immediately.',
      'Have the patient sit down on the floor leaning against a wall in a comfortable position.',
      'Loosen tight clothing around the neck and waist.',
      'If available and not allergic, give 1 adult aspirin (300mg) to chew slowly.',
      'If the person becomes unresponsive and stops breathing normally, start CPR (100–120 chest compressions per minute).',
      'Use an Automated External Defibrillator (AED) if one is available nearby.'
    ],
    whatNotToDo: [
      'Do NOT leave the patient alone or unattended.',
      'Do NOT wait to see if chest pain subsides before calling for help.',
      'Do NOT allow the patient to walk, drive, or exert themselves.',
      'Do NOT give aspirin if they are severely bleeding or allergic.'
    ]
  },
  {
    _id: 'guide-burns',
    category: 'burns',
    title: 'Burns & Scalds',
    description: 'First aid treatment for thermal, chemical, steam, and electrical burn injuries.',
    severity: 'high',
    emergencyNumber: '108',
    symptoms: [
      'Red, swollen, and painful skin (1st degree)',
      'Blisters and severe intense pain (2nd degree)',
      'Charred, white, blackened, or leathery skin with numbness (3rd degree)'
    ],
    whatToDo: [
      'Cool the burn immediately under cool, gently running tap water for at least 20 minutes.',
      'Carefully remove jewelry, belts, or tight clothing around the area before swelling begins.',
      'Cover the cooled burn loosely with clean plastic cling wrap or a sterile non-stick dressing.',
      'Keep the person warm with a blanket over unburned areas to prevent hypothermia.',
      'Seek urgent medical help for burns larger than 3 inches, or on face, hands, joints, or groin.'
    ],
    whatNotToDo: [
      'Do NOT use ice, ice water, butter, oil, toothpaste, or ointments on burns.',
      'Do NOT burst, prick, or peel blisters.',
      'Do NOT pull away clothing that is stuck or melted to the skin (cut around it).',
      'Do NOT apply adhesive bandages directly onto burned skin.'
    ]
  },
  {
    _id: 'guide-snake-bite',
    category: 'snake-bite',
    title: 'Snake Bite',
    description: 'Urgent first aid protocol for venomous and non-venomous snake bites.',
    severity: 'critical',
    emergencyNumber: '108',
    symptoms: [
      'Two puncture fang marks with localized bleeding',
      'Rapid swelling, severe burning pain, and skin discoloration',
      'Dizziness, blurred vision, excessive sweating, and salivation',
      'Difficulty breathing, muscle paralysis, and slurred speech'
    ],
    whatToDo: [
      'Move safely away from the snake to avoid further strikes.',
      'Keep the patient completely calm, immobilized, and still to slow venom circulation.',
      'Call emergency services (108) immediately or transport to the nearest hospital with anti-venom.',
      'Remove rings, bracelets, watches, and tight footwear from the affected limb immediately.',
      'Immobilize the bitten limb with a splint at or slightly below the level of the heart.'
    ],
    whatNotToDo: [
      'Do NOT try to cut the wound or suck out venom with your mouth.',
      'Do NOT apply a tight tourniquet (can cause gangrene and limb loss).',
      'Do NOT apply ice, electricity, or chemical herbal pastes.',
      'Do NOT try to capture or kill the snake (take a safe photo from a distance if possible).'
    ]
  },
  {
    _id: 'guide-electric-shock',
    category: 'electric-shock',
    title: 'Electric Shock',
    description: 'Critical safety steps and first aid for low and high voltage electrical contact.',
    severity: 'critical',
    emergencyNumber: '108',
    symptoms: [
      'Entry and exit burn marks on skin',
      'Severe muscle spasms or being "frozen" to the source',
      'Irregular pulse, cardiac arrest, or loss of consciousness',
      'Confusion, memory loss, or breathing difficulty'
    ],
    whatToDo: [
      'FIRST: Cut off the main power supply or trip the circuit breaker immediately.',
      'If power cannot be cut, use a dry non-conductive object (wooden broom, plastic stick) to separate the victim.',
      'Call emergency numbers (108 / 112) right away.',
      'Check breathing and responsiveness. Begin CPR if the person is not breathing.',
      'Cover visible entry and exit burns with a sterile dry dressing.'
    ],
    whatNotToDo: [
      'Do NOT touch the victim with bare hands while they are still in contact with electrical current.',
      'Do NOT use anything wet or metallic to move wires or people.',
      'Do NOT approach downed outdoor power lines (stay at least 10 meters / 33 feet away).'
    ]
  },
  {
    _id: 'guide-choking',
    category: 'choking',
    title: 'Choking & Airway Block',
    description: 'Emergency response for adult and child airway obstruction (Heimlich Maneuver).',
    severity: 'critical',
    emergencyNumber: '108',
    symptoms: [
      'Clutching the throat with hands (universal choking sign)',
      'Inability to talk, cry, or cough forcefully',
      'Wheezing, whistling sounds, or silent gasping',
      'Bluish or grayish lips, face, and fingernails (cyanosis)'
    ],
    whatToDo: [
      'Ask "Are you choking?" If they can cough forcefully, encourage them to keep coughing.',
      'If unable to breathe, stand behind them and lean them slightly forward.',
      'Deliver 5 firm back blows between the shoulder blades with the heel of your hand.',
      'If still blocked, perform 5 abdominal thrusts (Heimlich): wrap arms around waist, make a fist above navel, pull inward and upward sharply.',
      'Alternate 5 back blows and 5 abdominal thrusts until object is expelled.',
      'If person loses consciousness, lower them to floor and start CPR.'
    ],
    whatNotToDo: [
      'Do NOT perform abdominal thrusts on infants under 1 year (use chest thrusts).',
      'Do NOT perform blind finger sweeps in the mouth (may push object deeper).',
      'Do NOT give water to someone who is actively choking.'
    ]
  },
  {
    _id: 'guide-severe-bleeding',
    category: 'severe-bleeding',
    title: 'Severe Bleeding',
    description: 'How to control major hemorrhage and arterial bleeding to prevent fatal shock.',
    severity: 'critical',
    emergencyNumber: '108',
    symptoms: [
      'Spurting bright red blood (arterial) or continuous heavy dark blood flow',
      'Blood soaking through clothing and dressings rapidly',
      'Pale, clammy skin, confusion, weakness, and fading pulse'
    ],
    whatToDo: [
      'Call emergency medical services immediately.',
      'Apply firm, continuous direct pressure over the wound using a sterile gauze or clean cloth.',
      'Maintain continuous pressure for at least 10–15 minutes without lifting to check.',
      'If blood soaks through, add another cloth on top — do not remove the original dressing.',
      'Lay the person down flat, elevate legs slightly if no spinal injury is suspected, and keep warm.'
    ],
    whatNotToDo: [
      'Do NOT remove embedded objects (knives, glass) — pack dressings around them to stabilize.',
      'Do NOT remove blood-soaked dressings (always layer fresh ones on top).',
      'Do NOT wash large, deep bleeding wounds with running water.'
    ]
  },
  {
    _id: 'guide-stroke',
    category: 'stroke',
    title: 'Stroke (F.A.S.T.)',
    description: 'Recognizing the signs of stroke and taking fast action within the golden hour.',
    severity: 'critical',
    emergencyNumber: '108',
    symptoms: [
      'F - Face Drooping: One side of the face droops or feels numb when smiling',
      'A - Arm Weakness: One arm is weak, numb, or drifts downward when raised',
      'Speech Difficulty: Slurred speech, unable to speak, or hard to understand',
      'Time to Call: Note the exact time symptoms started and call emergency immediately'
    ],
    whatToDo: [
      'Call 108 / 112 immediately. Every minute saved preserves brain tissue.',
      'Keep the person lying down with their head and shoulders slightly elevated on a pillow.',
      'Note the exact time symptoms first began (crucial for clot-busting medication eligibility).',
      'Loosen tight clothing and ensure their airway is clear.',
      'If unconscious or vomiting, place them in the recovery position on their affected side.'
    ],
    whatNotToDo: [
      'Do NOT give any food, drink, or medications (including aspirin, which can worsen hemorrhagic strokes).',
      'Do NOT let the person sleep or drive themselves to hospital.',
      'Do NOT wait to see if symptoms improve.'
    ]
  },
  {
    _id: 'guide-flood',
    category: 'flood',
    title: 'Flood Safety & Rescue',
    description: 'Survival guidelines, evacuation protocols, and water rescue safety during floods.',
    severity: 'high',
    emergencyNumber: '112',
    symptoms: [
      'Rapidly rising water levels in streets or buildings',
      'Fast-moving brown murky flood water',
      'Disrupted electricity and structural weakening'
    ],
    whatToDo: [
      'Move to higher ground or top floors immediately.',
      'Turn off electricity at the main breaker before water enters your premises.',
      'Carry emergency drinking water, dry food, flashlights, and vital medications.',
      'Signal rescue teams from rooftop/balcony using brightly colored cloth or flashlight.',
      'Listen to local disaster management broadcasts (NDRF / State Emergency).'
    ],
    whatNotToDo: [
      'Do NOT walk through moving floodwaters (just 6 inches can sweep you off your feet).',
      'Do NOT drive into flooded roadways ("Turn Around, Don\'t Drown").',
      'Do NOT touch electrical appliances, cords, or outlets while standing in water.',
      'Do NOT drink tap or flood water (use boiled or bottled water).'
    ]
  },
  {
    _id: 'guide-earthquake',
    category: 'earthquake',
    title: 'Earthquake',
    description: 'Immediate protective measures during seismic tremors and post-quake safety.',
    severity: 'high',
    emergencyNumber: '112',
    symptoms: [
      'Violent ground shaking and rumbling',
      'Falling ceiling tiles, light fixtures, glass, and wall debris',
      'Power outages and fire alarms activating'
    ],
    whatToDo: [
      'DROP to your hands and knees.',
      'COVER your head and neck under a sturdy table or desk.',
      'HOLD ON to your shelter until the shaking stops completely.',
      'If outdoors, move to an open area away from power lines, trees, and buildings.',
      'After shaking stops, check for gas leaks, smell of smoke, and structural cracks.'
    ],
    whatNotToDo: [
      'Do NOT use elevators during or immediately after an earthquake.',
      'Do NOT run outside while tremors are active (falling glass/masonry causes most injuries).',
      'Do NOT use matches, lighters, or open flames (risk of ignited gas leaks).',
      'Do NOT stand under heavy wall-mounted mirrors or glass windows.'
    ]
  }
];

export const getFallbackGuide = (categoryOrId: string): GuideDetail | undefined => {
  return FALLBACK_GUIDES.find(
    g => g.category.toLowerCase() === categoryOrId.toLowerCase() || g._id === categoryOrId
  );
};
