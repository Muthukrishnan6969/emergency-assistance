import React from 'react';
import { PhoneCall } from 'lucide-react';

const SOSButton: React.FC = () => {
  const handleSOS = () => {
    // In a real scenario, this might trigger multiple actions like calling an API, sending SMS, etc.
    // For this prototype, we'll dial the national emergency number (e.g., 112).
    window.location.href = 'tel:112';
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <button
        onClick={handleSOS}
        className="sos-pulse bg-red-600 hover:bg-red-700 text-white rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-2xl transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300"
        aria-label="Activate SOS"
      >
        <PhoneCall size={64} className="mb-2" />
        <span className="text-4xl font-black tracking-widest">SOS</span>
      </button>
      <p className="mt-6 text-gray-600 font-medium text-center max-w-xs">
        Tap the button above in case of an immediate emergency.
      </p>
    </div>
  );
};

export default SOSButton;
