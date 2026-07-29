import React from 'react';
import Header from '../components/Header';
import SOSButton from '../components/SOSButton';
import ActionCard from '../components/ActionCard';
import LocationSharing from '../components/LocationSharing';
import { Ambulance, ShieldAlert, Flame } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="container mx-auto px-4 max-w-lg mt-6">
        <SOSButton />
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <ActionCard 
            title="Ambulance" 
            icon={Ambulance} 
            color="bg-red-500 hover:bg-red-600" 
            phoneNumber="108" 
          />
          <ActionCard 
            title="Police" 
            icon={ShieldAlert} 
            color="bg-blue-600 hover:bg-blue-700" 
            phoneNumber="100" 
          />
          <ActionCard 
            title="Fire Service" 
            icon={Flame} 
            color="bg-orange-500 hover:bg-orange-600" 
            phoneNumber="101" 
          />
          <ActionCard 
            title="Helpline" 
            icon={ShieldAlert} 
            color="bg-purple-500 hover:bg-purple-600" 
            phoneNumber="112" 
          />
        </div>

        <LocationSharing />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is a prototype Emergency Dashboard.</p>
          <p>No login is required to use these services.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
