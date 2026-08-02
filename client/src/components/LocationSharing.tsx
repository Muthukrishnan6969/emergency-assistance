import React, { useState } from 'react';
import { MapPin, Share2, MessageSquare, Copy, Check, Navigation, AlertCircle } from 'lucide-react';

const LocationSharing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);

  const getPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      });
    });
  };

  const handleShareLocation = async (method: 'native' | 'whatsapp' | 'sms' | 'copy' = 'native') => {
    setLoading(true);
    setError(null);

    try {
      let lat = lastCoords?.lat;
      let lng = lastCoords?.lng;

      if (!lat || !lng) {
        const position = await getPosition();
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        setLastCoords({ lat, lng });
      }

      const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
      const message = `🚨 EMERGENCY! I need help. Here is my current GPS location: ${mapsLink}`;

      if (method === 'native' && navigator.share) {
        await navigator.share({
          title: '🚨 Emergency Location Sharing',
          text: message,
          url: mapsLink,
        });
      } else if (method === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
      } else if (method === 'sms') {
        window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
      } else {
        // Copy to clipboard
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError('Could not access device GPS. Please enable location permissions in browser settings.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <MapPin size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Share Emergency GPS</h3>
            <p className="text-xs text-gray-500">Send live coordinates to family or responders</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 my-3 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {lastCoords && (
          <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded-xl border border-emerald-200 my-3 flex items-center justify-between">
            <span>GPS: {lastCoords.lat.toFixed(4)}, {lastCoords.lng.toFixed(4)}</span>
            <a 
              href={`https://www.google.com/maps?q=${lastCoords.lat},${lastCoords.lng}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-600 font-bold underline flex items-center gap-0.5"
            >
              View <Navigation size={11} />
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => handleShareLocation('native')}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-60"
        >
          <Share2 size={18} />
          <span>{loading ? 'Detecting GPS...' : 'Share Live Location'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => handleShareLocation('whatsapp')}
            disabled={loading}
            className="flex items-center justify-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 px-3 rounded-xl text-xs border border-emerald-200 transition-colors"
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => handleShareLocation('copy')}
            disabled={loading}
            className="flex items-center justify-center space-x-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-xl text-xs border border-gray-200 transition-colors"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSharing;
