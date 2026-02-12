import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'; 
import useUserStore from '../../store/usePlayerStore'

import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';

export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const syncUser = useUserStore((state) => state.syncUser);
    const logout = useUserStore((state) => state.logout);  

    const isMounted = useRef(false);

    useEffect(() => {
        if (!userData || !userData.isLoggedIn) {
            return;
        }

        if (userData.isLoggedIn && !userData.isConfigured) {
            navigate('/evaluation');
        }
        
        isMounted.current = true;
    }, [userData, navigate]);

    useEffect(() => {
        if (!isMounted.current || !userData?.isLoggedIn) return;

        const timeoutId = setTimeout(() => {
             console.log("Auto-Syncing...");
             if (syncUser) syncUser(); 
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [userData, syncUser]); 

    if (!userData?.isLoggedIn) {
        return <div className="dashboard">Loading System...</div>;
    }

    return (

        <>
        <button onClick={logout}>Logout</button>
        <div className='dashboard'>
            <h2>Dashboard</h2>
            <StatusWindow />
        </div>
        <Navbar />
        </>
    )
}