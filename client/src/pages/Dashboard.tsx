import React from 'react';
import Header from '../components/Header';
import SOSButton from '../components/SOSButton';
import ActionCard from '../components/ActionCard';
import LocationSharing from '../components/LocationSharing';
import { Ambulance, ShieldAlert, Flame, PhoneCall, Map, BookOpen, ChevronRight, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-12">
      <Header />
      
      <main className="container mx-auto px-4 max-w-lg mt-5 space-y-6">
        {/* Main SOS Trigger Button */}
        <SOSButton />
        
        {/* Quick Emergency Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link 
            to="/nearby" 
            className="group bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all">
                <Map size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Live Emergency Map</h3>
                <p className="text-xs text-blue-100 mt-0.5">Find nearest hospitals & police</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-blue-200 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link 
            to="/first-aid" 
            className="group bg-gradient-to-br from-red-600 to-rose-700 p-4 rounded-2xl text-white shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all">
                <BookOpen size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">First Aid Guides</h3>
                <p className="text-xs text-red-100 mt-0.5">Instant life-saving protocols</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-red-200 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 1-Tap Emergency Calling Numbers */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Instant Emergency Calling</h2>
            <span className="text-[11px] text-red-600 font-semibold">Toll Free 24x7</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              title="Fire Brigade" 
              icon={Flame} 
              color="bg-orange-500 hover:bg-orange-600" 
              phoneNumber="101" 
            />
            <ActionCard 
              title="National Helpline" 
              icon={PhoneCall} 
              color="bg-purple-600 hover:bg-purple-700" 
              phoneNumber="112" 
            />
          </div>
        </div>

        {/* Quick First Aid Highlights (Top Emergencies) */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Critical First Aid</h3>
            <Link to="/first-aid" className="text-xs font-bold text-red-600 hover:underline">
              View All 10 →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link 
              to="/first-aid/heart-attack" 
              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-2 transition-colors"
            >
              <Activity size={16} />
              <span>Heart Attack</span>
            </Link>
            <Link 
              to="/first-aid/road-accident" 
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center gap-2 transition-colors"
            >
              <ShieldAlert size={16} />
              <span>Road Accident</span>
            </Link>
            <Link 
              to="/first-aid/snake-bite" 
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-2 transition-colors"
            >
              <Zap size={16} />
              <span>Snake Bite</span>
            </Link>
            <Link 
              to="/first-aid/burns" 
              className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 flex items-center gap-2 transition-colors"
            >
              <Flame size={16} />
              <span>Burns & Scalds</span>
            </Link>
          </div>
        </div>

        {/* Location Sharing Card */}
        <LocationSharing />
      </main>
    </div>
  );
};

export default Dashboard;
