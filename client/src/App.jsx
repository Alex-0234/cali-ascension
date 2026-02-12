import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useUserStore from './store/usePlayerStore';

import Login from './pages/Auth/Login'; 
import Register from './pages/Auth/Register';
import SkillTree from './components/reactflow/SkillTree';
import Awakening from './pages/Onboarding/Awakening';
import Evaluation from './pages/Onboarding/Evaluation';
import Dashboard from './pages/Dashboard/Dashboard';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const userData = useUserStore((state) => state.userData);
  
  useEffect(() => {
      if (!userData?.isLoggedIn && !localStorage.getItem('userId')) {
          navigate('/login');
      }
  }, [userData, navigate]);

  return children;
};

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const userData = useUserStore((state) => state.userData);
  /* const setUserData = useUserStore((state) => state.setUserData); */

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId && !userData?.isLoggedIn) {
        console.log("App: Restoring user session...");
        fetchUser(storedUserId);
    }
  }, []); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={
           // Dashboard je protected, ale díky useEffectu nahoře už se data načítají
           <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/evaluation" element={
          <ProtectedRoute><Evaluation /></ProtectedRoute>
        } />
        
        <Route path="/awakening" element={
          <ProtectedRoute><Awakening /></ProtectedRoute>
        } />

        <Route path="/skill-tree" element={
          <ProtectedRoute><SkillTree /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;