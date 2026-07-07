
import { useEffect, useState } from 'react';
import useUserStore from './store/usePlayerStore';

import Login from './pages/Auth/Login'; 
import Register from './pages/Auth/Register';
import ServerWakeup from './pages/Dashboard/serverWakeup'
import System from './pages/Dashboard/system'

import './index.css'



function App() {
  const { userData, fetchUser, syncUser} = useUserStore();

  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    async function Test() {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);
      if (response.ok) {
        setIsServerReady(true);
        console.log('Server is Ready..')
      }
    }
    Test();
  }, [])

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

  useEffect(() => {
    console.log(userData);
  },[userData])

  if (!isServerReady) {
      return <ServerWakeup onServerReady={() => setIsServerReady(true)} />;
  }

  return (
    <System />
  );
}

export default App;