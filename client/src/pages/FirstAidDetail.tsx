import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, PhoneCall, AlertCircle } from 'lucide-react';
import Header from '../components/Header';

interface GuideDetail {
  _id: string;
  category: string;
  title: string;
  description: string;
  symptoms: string[];
  whatToDo: string[];
  whatNotToDo: string[];
  emergencyNumber: string;
}

const FirstAidDetail: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/guides/${category}`);
        setGuide(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch guide details. The guide may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      <main className="container mx-auto px-4 max-w-3xl mt-6">
        <Link to="/first-aid" className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-1" />
          Back to Guides
        </Link>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
            <div className="h-32 bg-gray-200 rounded-xl w-full mb-4"></div>
            <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-xl text-center">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Guide Not Found</h2>
            <p>{error}</p>
          </div>
        ) : guide ? (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{guide.title}</h1>
              <p className="text-gray-600 text-lg">{guide.description}</p>
              
              <div className="mt-6">
                <a 
                  href={`tel:${guide.emergencyNumber}`}
                  className="inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-bold shadow-md transition-colors w-full sm:w-auto"
                >
                  <PhoneCall size={20} />
                  <span>Call {guide.emergencyNumber} Now</span>
                </a>
              </div>
            </div>

            {guide.symptoms && guide.symptoms.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="text-yellow-500 mr-2" size={24} />
                  Common Symptoms
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {guide.symptoms.map((symptom, idx) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DOs */}
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={24} />
                  What To Do
                </h3>
                <ul className="space-y-3">
                  {guide.whatToDo.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONTs */}
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <XCircle className="text-red-600 mr-2" size={24} />
                  What NOT To Do
                </h3>
                <ul className="space-y-3">
                  {guide.whatNotToDo.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">✗</span>
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default FirstAidDetail;
