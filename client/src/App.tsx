import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import NearbyServices from './pages/NearbyServices';
import FirstAidList from './pages/FirstAidList';
import FirstAidDetail from './pages/FirstAidDetail';
import AIDispatchPage from './pages/AIDispatchPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ai-dispatch" element={<AIDispatchPage />} />
        <Route path="/nearby" element={<NearbyServices />} />
        <Route path="/first-aid" element={<FirstAidList />} />
        <Route path="/first-aid/:category" element={<FirstAidDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
