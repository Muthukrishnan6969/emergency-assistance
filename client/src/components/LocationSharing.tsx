import React, { useState } from 'react';
import { MapPin, Share2 } from 'lucide-react';

const LocationSharing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShareLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const { latitude, longitude } = position.coords;
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = `I have an emergency! Here is my current location: ${googleMapsLink}`;

        // Attempt to open WhatsApp, fallback to SMS
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.open(`whatsapp://send?text=${encodeURIComponent(message)}`, '_blank');
        } else {
          // If desktop, just alert it for this prototype, or try mailto
          alert(`Location found:\n${googleMapsLink}\n\n(On a mobile device, this would open WhatsApp or SMS)`);
        }
      },
      (err) => {
        setLoading(false);
        setError('Unable to retrieve your location. Please check your permissions.');
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <MapPin className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Share My Location</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Instantly share your precise GPS coordinates with emergency contacts via messaging apps.
      </p>
      
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      
      <button
        onClick={handleShareLocation}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-70"
      >
        <Share2 size={20} />
        <span>{loading ? 'Detecting Location...' : 'Share Location Now'}</span>
      </button>
    </div>
  );
};

export default LocationSharing;
