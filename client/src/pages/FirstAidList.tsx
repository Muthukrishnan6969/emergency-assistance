import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Activity, AlertTriangle, Flame, Zap, Droplets, Mountain } from 'lucide-react';
import Header from '../components/Header';

interface GuideSummary {
  _id: string;
  category: string;
  title: string;
  description: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'road-accident': return <AlertTriangle className="text-yellow-500" size={32} />;
    case 'heart-attack': return <Activity className="text-red-500" size={32} />;
    case 'burns': return <Flame className="text-orange-500" size={32} />;
    case 'electric-shock': return <Zap className="text-yellow-600" size={32} />;
    case 'flood': return <Droplets className="text-blue-500" size={32} />;
    case 'earthquake': return <Mountain className="text-amber-700" size={32} />;
    default: return <BookOpen className="text-gray-500" size={32} />;
  }
};

const FirstAidList: React.FC = () => {
  const [guides, setGuides] = useState<GuideSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/guides');
        setGuides(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch guides. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      <main className="container mx-auto px-4 max-w-3xl mt-8">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpen className="text-red-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">First Aid Guides</h2>
        </div>
        
        <p className="text-gray-600 mb-8">
          Select an emergency situation below to view quick, life-saving instructions. 
          <strong> In any critical situation, always call emergency services first.</strong>
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl shadow border border-gray-100 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((guide) => (
              <Link 
                key={guide._id} 
                to={`/first-aid/${guide.category}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className="mb-4 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center">
                  {getCategoryIcon(guide.category)}
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{guide.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{guide.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FirstAidList;
