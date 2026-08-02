import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Navigation, Phone, Compass } from 'lucide-react';

export interface Service {
  _id: string;
  name: string;
  address: string;
  phone: string;
  type: 'hospital' | 'police' | 'fire';
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
  distance?: number;
}

interface MapComponentProps {
  userLocation: [number, number] | null;
  services: Service[];
  selectedService?: Service | null;
  onSelectService?: (service: Service) => void;
  onRecenter?: () => void;
}

// Crisp, Retina-ready inline SVG Leaflet DivIcons (100% offline, zero network dependencies)
const createCustomSvgIcon = (type: 'hospital' | 'police' | 'fire' | 'user') => {
  let bgGradient = 'from-red-600 to-rose-700';
  let borderColor = '#dc2626';
  let iconSvg = '';

  if (type === 'hospital') {
    bgGradient = 'background: linear-gradient(135deg, #ef4444, #b91c1c);';
    borderColor = '#991b1b';
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 6v12M6 12h12"/>
      </svg>
    `;
  } else if (type === 'police') {
    bgGradient = 'background: linear-gradient(135deg, #3b82f6, #1d4ed8);';
    borderColor = '#1e40af';
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    `;
  } else if (type === 'fire') {
    bgGradient = 'background: linear-gradient(135deg, #f97316, #c2410c);';
    borderColor = '#9a3412';
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    `;
  } else {
    // User GPS location
    return L.divIcon({
      className: 'custom-user-gps-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); z-index: 10;"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  }

  const html = `
    <div style="
      position: relative;
      width: 36px;
      height: 44px;
      display: flex;
      flex-direction: column;
      align-items: center;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
      cursor: pointer;
      transition: transform 0.15s ease;
    ">
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50%;
        ${bgGradient}
        border: 2px solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25);
      ">
        ${iconSvg}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${borderColor};
        margin-top: -2px;
      "></div>
    </div>
  `;

  return L.divIcon({
    className: `custom-marker-${type}`,
    html,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -42],
  });
};

const icons = {
  hospital: createCustomSvgIcon('hospital'),
  police: createCustomSvgIcon('police'),
  fire: createCustomSvgIcon('fire'),
  user: createCustomSvgIcon('user'),
};

// Component to handle auto-resize and center tracking
const MapResizeAndCenterHandler: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size on mount and on orientation/resize
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, Math.max(map.getZoom(), 13), {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  userLocation, 
  services,
  onRecenter 
}) => {
  // Default center (Chennai / fallback)
  const defaultCenter: [number, number] = [13.0827, 80.2707];
  const center: [number, number] = userLocation || defaultCenter;

  const handleDirections = (lat: number, lng: number) => {
    const origin = userLocation ? `${userLocation[0]},${userLocation[1]}` : '';
    const dest = `${lat},${lng}`;
    const url = userLocation 
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${dest}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[460px] md:min-h-[550px] relative rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        touchZoom={true}
        tapHold={true}
        style={{ height: '100%', width: '100%', minHeight: '380px' }}
      >
        <MapResizeAndCenterHandler center={center} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {/* User GPS Radar & Accuracy Circle */}
        {userLocation && (
          <>
            <Circle 
              center={userLocation} 
              radius={350} 
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.12, weight: 1.5 }} 
            />
            <Marker position={userLocation} icon={icons.user}>
              <Popup className="custom-emergency-popup">
                <div className="p-2 text-center">
                  <div className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                    📍 Your Current GPS Location
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Clustered Emergency Service Markers */}
        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {services.map(service => {
            // Ensure coordinates format [lat, lng]
            const position: [number, number] = [
              service.location.coordinates[1],
              service.location.coordinates[0]
            ];
            
            const badgeColor = 
              service.type === 'hospital' ? 'bg-red-100 text-red-700 border-red-200' :
              service.type === 'police' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-orange-100 text-orange-700 border-orange-200';

            return (
              <Marker 
                key={service._id} 
                position={position} 
                icon={icons[service.type] || icons.hospital}
              >
                <Popup className="custom-emergency-popup min-w-[220px]">
                  <div className="p-2 text-left">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1.5 ${badgeColor}`}>
                      {service.type === 'hospital' ? '🏥 Hospital' : service.type === 'police' ? '🚓 Police Station' : '🚒 Fire Station'}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 leading-snug mb-1">{service.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{service.address}</p>
                    
                    <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                      {service.phone && service.phone !== '108' && (
                        <a 
                          href={`tel:${service.phone}`} 
                          className="flex-1 inline-flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-colors"
                        >
                          <Phone size={12} /> Call
                        </a>
                      )}
                      <button 
                        onClick={() => handleDirections(position[0], position[1])}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-colors"
                      >
                        <Navigation size={12} /> Directions
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Recenter / GPS Floating Button on Mobile Map */}
      {onRecenter && (
        <button
          onClick={onRecenter}
          className="absolute bottom-4 right-4 z-[999] bg-white text-gray-800 hover:text-red-600 p-3 rounded-2xl shadow-xl border border-gray-200 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold"
          title="Recenter to my GPS Location"
          aria-label="Recenter to my location"
        >
          <Compass size={18} className="text-red-600 animate-spin-slow" />
          <span className="hidden sm:inline">My Location</span>
        </button>
      )}
    </div>
  );
};

export default MapComponent;
