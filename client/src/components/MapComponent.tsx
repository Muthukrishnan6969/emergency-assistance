import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different services
const getCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  hospital: getCustomIcon('red'),
  police: getCustomIcon('blue'),
  fire: getCustomIcon('orange'),
  user: getCustomIcon('green')
};

interface Service {
  _id: string;
  name: string;
  address: string;
  phone: string;
  type: 'hospital' | 'police' | 'fire';
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
}

interface MapComponentProps {
  userLocation: [number, number] | null;
  services: Service[];
}

const ChangeView: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, services }) => {
  const center: [number, number] = userLocation || [40.7128, -74.0060];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        {userLocation && <ChangeView center={userLocation} zoom={13} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <Marker position={userLocation} icon={icons.user}>
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>
        )}

        <MarkerClusterGroup chunkedLoading>
          {services.map(service => {
            // MongoDB uses [lng, lat], Leaflet uses [lat, lng]
            const position: [number, number] = [
              service.location.coordinates[1],
              service.location.coordinates[0]
            ];
            
            return (
              <Marker 
                key={service._id} 
                position={position} 
                icon={icons[service.type]}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-sm mb-1">{service.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{service.address}</p>
                    <a href={`tel:${service.phone}`} className="text-blue-600 font-medium text-xs">
                      📞 {service.phone}
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
