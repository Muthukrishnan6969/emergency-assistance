import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <AlertTriangle size={80} className="text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        The page you are looking for does not exist.
      </p>
      <Link 
        to="/" 
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
