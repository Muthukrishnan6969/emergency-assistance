import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation, Phone, MapPin } from 'lucide-react';
import Header from '../components/Header';
import MapComponent from '../components/MapComponent';

interface Service {
  _id: string;
  name: string;
  address: string;
  phone: string;
  type: 'hospital' | 'police' | 'fire';
  location: {
    coordinates: [number, number];
  };
}

const NearbyServices: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    // 1. Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          fetchServices(lat, lng);
        },
        (err) => {
          console.error(err);
          setError('Could not get your location. Using default location (New York) for demonstration.');
          const defaultLat = 40.7128;
          const defaultLng = -74.0060;
          setUserLocation([defaultLat, defaultLng]);
          fetchServices(defaultLat, defaultLng);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  const fetchServices = async (lat: number, lng: number) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services/nearby?lat=${lat}&lng=${lng}&radius=20000`);
      setServices(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch nearby services.');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = activeFilter === 'all' ? services : services.filter(s => s.type === activeFilter);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  };

  const getDistanceText = (service: Service) => {
    if (!userLocation) return '';
    const dist = calculateDistance(
      userLocation[0], userLocation[1], 
      service.location.coordinates[1], service.location.coordinates[0]
    );
    return `${dist.toFixed(1)} km away`;
  };

  const handleNavigate = (service: Service) => {
    if (!userLocation) return;
    const destLat = service.location.coordinates[1];
    const destLng = service.location.coordinates[0];
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${destLat},${destLng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Left Column: Map & Filters */}
        <div className="md:w-2/3 flex flex-col">
          <div className="flex justify-between items-center mb-4 overflow-x-auto gap-2 pb-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All Services
            </button>
            <button 
              onClick={() => setActiveFilter('hospital')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'hospital' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
            >
              Hospitals
            </button>
            <button 
              onClick={() => setActiveFilter('police')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'police' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              Police
            </button>
            <button 
              onClick={() => setActiveFilter('fire')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === 'fire' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'}`}
            >
              Fire Stations
            </button>
          </div>

          <div className="flex-1 min-h-[400px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl animate-pulse">
                <span className="text-gray-500">Loading Map...</span>
              </div>
            ) : (
              <MapComponent userLocation={userLocation} services={filteredServices} />
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Right Column: List of Services */}
        <div className="md:w-1/3 bg-white rounded-xl shadow-md border border-gray-100 p-4 overflow-y-auto max-h-[600px]">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <MapPin size={20} className="mr-2 text-red-600" />
            Nearby Places
          </h2>
          
          {loading ? (
            <p className="text-gray-500 text-center py-4">Finding services...</p>
          ) : filteredServices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No services found nearby.</p>
          ) : (
            <div className="space-y-4">
              {filteredServices.map(service => (
                <div key={service._id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-bold text-gray-800 text-sm">{service.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{service.address}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {getDistanceText(service)}
                    </span>
                    <div className="flex space-x-2">
                      <a 
                        href={`tel:${service.phone}`}
                        className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                        title="Call"
                      >
                        <Phone size={16} />
                      </a>
                      <button 
                        onClick={() => handleNavigate(service)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        title="Navigate"
                      >
                        <Navigation size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NearbyServices;
