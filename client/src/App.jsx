import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useUserStore from './store/usePlayerStore';

import Login from './pages/Auth/Login'; 
import Register from './pages/Auth/Register';
import SkillTreeScreen from './components/reactflow/SkillTree';
import Awakening from './pages/Onboarding/Awakening';
import Evaluation from './pages/Onboarding/Evaluation';
import Dashboard from './pages/Dashboard/Dashboard';
import WorkoutScreen from './pages/Dashboard/workoutScreen';
import ServerWakeup from './pages/Dashboard/SystemBootScreen';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const userData = useUserStore((state) => state.userData);
  
  useEffect(() => {
      if (!userData.isLoading && !userData.isLoggedIn && !localStorage.getItem('userId')) {
          navigate('/login');
      }
  }, [userData.isLoading, userData.isLoggedIn, navigate]);

  if (userData.isLoading) return <div>System Initializing...</div>;

  return userData.isLoggedIn ? children : null;
};

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const syncUser = useUserStore((state) => state.syncUser);
  const userData = useUserStore((state) => state.userData);

  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
      const userId = localStorage.getItem('userId');
      if (isServerReady && userId && !userData.isLoggedIn) {
        fetchUser(userId); 
      }
  }, [fetchUser, userData.isLoggedIn, isServerReady]);

  useEffect(() => {
  const timeoutId = setTimeout(() => {
          if (isServerReady && userData.isLoggedIn) { 
              console.log("Auto-Syncing...");
              if (syncUser) syncUser(); 
          }
  }, 2000);

  return () => clearTimeout(timeoutId);
      
  }, [userData, syncUser, isServerReady]); 

  if (!isServerReady) {
      return <ServerWakeup onServerReady={() => setIsServerReady(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
           <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/evaluation" element={
          <ProtectedRoute><Evaluation /></ProtectedRoute>
        } />
        
        <Route path="/awakening" element={
          <ProtectedRoute><Awakening /></ProtectedRoute>
        } />
        
        <Route path="/daily" element={
          <ProtectedRoute><WorkoutScreen /></ProtectedRoute>
        } />

        <Route path="/skill-tree" element={
          <ProtectedRoute><SkillTreeScreen /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;