import React from 'react';
import { AlertCircle, Map, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <AlertCircle size={28} />
          <h1 className="text-xl font-bold tracking-wide">Emergency Assistance</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/nearby" className="flex items-center space-x-1 hover:text-red-200 transition-colors text-sm font-medium">
            <Map size={18} />
            <span className="hidden sm:inline">Nearby Services</span>
          </Link>
          <Link to="/first-aid" className="flex items-center space-x-1 hover:text-red-200 transition-colors text-sm font-medium">
            <BookOpen size={18} />
            <span className="hidden sm:inline">First Aid Guide</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
