import React from 'react';
import { AlertCircle, Map, BookOpen, Home, PhoneCall } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Main Navigation Header */}
      <header className="bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white/20 p-1.5 rounded-xl group-hover:bg-white/30 transition-all">
              <AlertCircle size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Emergency Assistance
              </h1>
              <span className="text-[10px] text-red-200 uppercase tracking-widest hidden xs:inline">
                Instant Rescue & First Aid
              </span>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation */}
          <nav className="flex items-center space-x-2 sm:space-x-3">
            <Link 
              to="/nearby" 
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive('/nearby') 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <Map size={16} />
              <span>Nearby Services</span>
            </Link>

            <Link 
              to="/first-aid" 
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive('/first-aid') 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <BookOpen size={16} />
              <span>First Aid Guide</span>
            </Link>

            <a 
              href="tel:112"
              className="hidden sm:flex items-center space-x-1 bg-red-950/40 hover:bg-red-950/60 text-white px-3 py-1.5 rounded-xl text-xs font-black border border-white/20 transition-all"
            >
              <PhoneCall size={14} className="text-red-300 animate-pulse" />
              <span>112</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation Bar for One-Thumb Access */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl py-1.5 px-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive('/') 
                ? 'text-red-600 font-bold scale-105' 
                : 'text-gray-500 font-medium'
            }`}
          >
            <Home size={20} />
            <span className="text-[10px] mt-0.5">SOS Home</span>
          </Link>

          <Link 
            to="/nearby" 
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive('/nearby') 
                ? 'text-red-600 font-bold scale-105' 
                : 'text-gray-500 font-medium'
            }`}
          >
            <Map size={20} />
            <span className="text-[10px] mt-0.5">Live Map</span>
          </Link>

          <Link 
            to="/first-aid" 
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive('/first-aid') 
                ? 'text-red-600 font-bold scale-105' 
                : 'text-gray-500 font-medium'
            }`}
          >
            <BookOpen size={20} />
            <span className="text-[10px] mt-0.5">First Aid</span>
          </Link>

          <a 
            href="tel:112"
            className="flex flex-col items-center py-1 px-3 rounded-xl text-red-600 font-black"
          >
            <div className="bg-red-600 text-white p-1 rounded-full animate-bounce">
              <PhoneCall size={14} />
            </div>
            <span className="text-[10px] mt-0.5">Call 112</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
