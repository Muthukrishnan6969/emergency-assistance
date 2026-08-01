require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
const PoliceStation = require('./models/PoliceStation');
const FireStation = require('./models/FireStation');
const FirstAidGuide = require('./models/FirstAidGuide');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/emergency_assistance');

const seedData = async () => {
  try {
    // Clear existing data
    await Hospital.deleteMany();
    await PoliceStation.deleteMany();
    await FireStation.deleteMany();
    await FirstAidGuide.deleteMany();

    // Create Dummy Hospitals (New York)
    const lat = 40.7128;
    const lng = -74.0060;

    // Create Dummy Hospitals (Tamil Nadu - Chennai)
    const tnLat = 13.0827;
    const tnLng = 80.2707;

    await Hospital.create([
      { name: 'City General Hospital', address: '123 Main St', phone: '123-456-7890', location: { type: 'Point', coordinates: [lng + 0.01, lat + 0.01] } },
      { name: 'Mercy Care Medical Center', address: '456 Oak Ave', phone: '987-654-3210', location: { type: 'Point', coordinates: [lng - 0.02, lat - 0.01] } },
      { name: 'Chennai General Hospital', address: 'EVR Periyar Salai, Park Town', phone: '044-25304000', location: { type: 'Point', coordinates: [tnLng + 0.002, tnLat + 0.001] } },
      { name: 'Apollo Hospitals Greams Road', address: '21 Greams Lane, Off Greams Road', phone: '044-28293333', location: { type: 'Point', coordinates: [tnLng - 0.015, tnLat - 0.022] } },
    ]);

    await PoliceStation.create([
      { name: 'Downtown Precinct', address: '789 Police Blvd', phone: '111-222-3333', location: { type: 'Point', coordinates: [lng + 0.015, lat - 0.005] } },
      { name: 'Egmore Police Station', address: 'Pantheon Road, Egmore', phone: '044-23452350', location: { type: 'Point', coordinates: [tnLng - 0.012, tnLat - 0.005] } },
      { name: 'T. Nagar Police Station', address: 'South Boag Road, T. Nagar', phone: '044-23452600', location: { type: 'Point', coordinates: [tnLng - 0.035, tnLat - 0.045] } },
    ]);

    await FireStation.create([
      { name: 'Engine 42', address: '101 Firehouse Row', phone: '444-555-6666', location: { type: 'Point', coordinates: [lng - 0.01, lat + 0.015] } },
      { name: 'Egmore Fire Station', address: 'Rukmani Lakshmipathi Road, Egmore', phone: '044-28554316', location: { type: 'Point', coordinates: [tnLng - 0.010, tnLat - 0.003] } },
      { name: 'Guindy Fire Station', address: 'GST Road, Guindy', phone: '044-22341233', location: { type: 'Point', coordinates: [tnLng - 0.055, tnLat - 0.075] } },
    ]);

    // First Aid Guides
    const guides = [
      {
        category: 'road-accident',
        title: 'Road Accident',
        description: 'First aid for victims of road traffic accidents.',
        symptoms: ['Bleeding', 'Unconsciousness', 'Difficulty breathing', 'Visible fractures'],
        whatToDo: [
          'Ensure your own safety before approaching the victim.',
          'Call emergency services immediately.',
          'Do not move the victim unless there is an immediate danger (like fire).',
          'Apply direct pressure to any bleeding wounds with a clean cloth.',
          'If the person is unconscious but breathing normally, place them in the recovery position.'
        ],
        whatNotToDo: [
          'Do not remove a helmet from a motorcyclist unless they cannot breathe.',
          'Do not give the victim anything to eat or drink.',
          'Do not move someone with a suspected spinal injury.'
        ],
        emergencyNumber: '108'
      },
      {
        category: 'heart-attack',
        title: 'Heart Attack',
        description: 'Immediate response when someone is suspected of having a heart attack.',
        symptoms: ['Chest pain or pressure', 'Pain spreading to the arm, neck, or jaw', 'Shortness of breath', 'Cold sweat', 'Dizziness or lightheadedness'],
        whatToDo: [
          'Call emergency medical services immediately.',
          'Have the person sit down, rest, and try to keep calm.',
          'Loosen any tight clothing.',
          'If the person is prescribed nitroglycerin, help them take it.',
          'If the person becomes unconscious and stops breathing, begin CPR immediately.'
        ],
        whatNotToDo: [
          'Do not leave the person alone.',
          'Do not wait to see if the symptoms go away.',
          'Do not give them anything to eat or drink.'
        ],
        emergencyNumber: '108'
      },
      {
        category: 'burns',
        title: 'Burns',
        description: 'First aid treatment for thermal, chemical, or electrical burns.',
        symptoms: ['Redness', 'Swelling', 'Pain', 'Blisters', 'Charred skin'],
        whatToDo: [
          'Remove the person from the heat source.',
          'Cool the burn under cool (not cold) running water for at least 20 minutes.',
          'Remove tight items, such as rings or clothing, from the burned area before it swells.',
          'Cover the burn with a sterile, non-fluffy dressing or clean plastic wrap.'
        ],
        whatNotToDo: [
          'Do not apply ice directly to the burn.',
          'Do not burst any blisters.',
          'Do not apply butter, ointments, or creams to a severe burn.',
          'Do not remove clothing that is stuck to the skin.'
        ],
        emergencyNumber: '108'
      },
      {
        category: 'snake-bite',
        title: 'Snake Bite',
        description: 'First aid procedure for a suspected venomous snake bite.',
        symptoms: ['Puncture marks', 'Severe pain and swelling', 'Nausea and vomiting', 'Breathing difficulty', 'Numbness or tingling'],
        whatToDo: [
          'Move away from the snake immediately.',
          'Keep the person calm and still to slow the spread of venom.',
          'Call for emergency medical help.',
          'Remove rings, watches, and tight clothing from the bitten limb.',
          'Keep the bitten limb at or below heart level.'
        ],
        whatNotToDo: [
          'Do not try to suck the venom out.',
          'Do not apply a tourniquet.',
          'Do not cut the wound.',
          'Do not apply ice or soak the wound in water.',
          'Do not attempt to catch or kill the snake.'
        ],
        emergencyNumber: '108'
      },
      {
        category: 'electric-shock',
        title: 'Electric Shock',
        description: 'Immediate response to an electric shock injury.',
        symptoms: ['Burns at the contact site', 'Muscle spasms', 'Unconsciousness', 'Difficulty breathing', 'Cardiac arrest'],
        whatToDo: [
          'Turn off the source of electricity if possible.',
          'If you cannot turn it off, use a dry, non-conducting object (like a wooden broom) to push the person away from the source.',
          'Call emergency medical services immediately.',
          'Check for breathing and pulse; begin CPR if necessary.',
          'Cover any electrical burns with a sterile dressing.'
        ],
        whatNotToDo: [
          'Do not touch the person with your bare hands if they are still in contact with the electrical source.',
          'Do not get near high-voltage wires until power is turned off.',
          'Do not move the person unless there is an immediate danger.'
        ],
        emergencyNumber: '108'
      },
      {
        category: 'flood',
        title: 'Flood',
        description: 'Survival and safety tips during a flood.',
        symptoms: ['Rising water levels', 'Fast-moving water', 'Debris in water'],
        whatToDo: [
          'Move to higher ground immediately.',
          'Listen to local emergency radio stations or alerts for instructions.',
          'Turn off utilities at the main switches or valves if instructed to do so.',
          'Disconnect electrical appliances.'
        ],
        whatNotToDo: [
          'Do not walk through moving water. Even 6 inches of moving water can make you fall.',
          'Do not drive into flooded areas. If floodwaters rise around your car, abandon it and move to higher ground.',
          'Do not touch electrical equipment if you are wet or standing in water.'
        ],
        emergencyNumber: '112'
      },
      {
        category: 'earthquake',
        title: 'Earthquake',
        description: 'Actions to take during and immediately after an earthquake.',
        symptoms: ['Violent shaking', 'Falling objects', 'Structural damage'],
        whatToDo: [
          'Drop to your hands and knees.',
          'Cover your head and neck under a sturdy table or desk.',
          'Hold on to your shelter until the shaking stops.',
          'If outside, move away from buildings, streetlights, and utility wires.',
          'If in a vehicle, pull over to a clear location and stop.'
        ],
        whatNotToDo: [
          'Do not run outside during the shaking.',
          'Do not use elevators.',
          'Do not light matches or use lighters (due to potential gas leaks).',
          'Do not stand in doorways (they do not provide protection from falling debris).'
        ],
        emergencyNumber: '112'
      }
    ];

    await FirstAidGuide.insertMany(guides);

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedData();
