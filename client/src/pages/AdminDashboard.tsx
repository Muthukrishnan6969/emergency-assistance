import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, MapPin, AlertTriangle, MessageSquare } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hospitals');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (model: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`http://localhost:5000/api/admin/data/${model}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 bg-gray-950 font-bold text-lg flex items-center">
          <Activity className="mr-2 text-red-500" />
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('hospitals')} className={`w-full flex items-center p-3 rounded transition-colors ${activeTab === 'hospitals' ? 'bg-red-600' : 'hover:bg-gray-800'}`}>
            <MapPin size={18} className="mr-3" /> Hospitals
          </button>
          <button onClick={() => setActiveTab('policestations')} className={`w-full flex items-center p-3 rounded transition-colors ${activeTab === 'policestations' ? 'bg-red-600' : 'hover:bg-gray-800'}`}>
            <AlertTriangle size={18} className="mr-3" /> Police
          </button>
          <button onClick={() => setActiveTab('firestations')} className={`w-full flex items-center p-3 rounded transition-colors ${activeTab === 'firestations' ? 'bg-red-600' : 'hover:bg-gray-800'}`}>
            <Activity size={18} className="mr-3" /> Fire
          </button>
          <button onClick={() => setActiveTab('guides')} className={`w-full flex items-center p-3 rounded transition-colors ${activeTab === 'guides' ? 'bg-red-600' : 'hover:bg-gray-800'}`}>
            <AlertTriangle size={18} className="mr-3" /> Guides
          </button>
          <button onClick={() => setActiveTab('feedback')} className={`w-full flex items-center p-3 rounded transition-colors ${activeTab === 'feedback' ? 'bg-red-600' : 'hover:bg-gray-800'}`}>
            <MessageSquare size={18} className="mr-3" /> Feedback
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center p-2 bg-gray-800 hover:bg-gray-700 rounded text-red-400 transition-colors">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab} Management</h1>
          <button className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">Add New</button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <th className="p-4">Name / Title</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {item.name || item.title}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {item.address || item.category || item.email}
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline mr-3">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-500">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
