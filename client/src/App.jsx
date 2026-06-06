import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useUserStore from './store/usePlayerStore';

import Terminal from './pages/Dashboard/terminal';
import Login from './pages/Auth/Login'; 
import Register from './pages/Auth/Register';
import SkillTreeScreen from './components/reactflow/SkillTree';
import Awakening from './pages/Onboarding/Awakening';
import Evaluation from './pages/Onboarding/Evaluation';
import WorkoutScreen from './pages/Dashboard/workoutScreen';
import ServerWakeup from './pages/Dashboard/SystemBootScreen';
import SystemLayout from './pages/Dashboard/SystemLayout';
import StatusWindow from './pages/Dashboard/StatusWindow';
import Settings from './pages/Dashboard/Settings'
import WorkoutHistoryBlock from './components/ui/workoutHistoryBlock';


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

  return (
    <Terminal content={<p>Working on it.</p>}/>
  );
}

export default App;