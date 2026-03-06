import useUserStore from '../../store/usePlayerStore'
import useUIStore from '../../store/useUIStore'

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';
import EditProfileModal from '../../components/stats/EditProfileModal';

import styles from '../../styles/dashboard.module.css'

export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const logout = useUserStore((state) => state.logout);  
    const isProfileOpen = useUIStore((state) => state.isProfileOpen)

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
        
    }, []);

    return (
        <>
        { isProfileOpen && (
                <EditProfileModal />
        )}
        <main className={`${styles.dashboard}`}>
            <div className={`${styles.dashboardHeader}`}>
                <h2>Dashboard</h2>
                <button className={`${styles.btnLogout}`} onClick={logout}>Logout</button>
            </div>

            {!userData.isConfigured && isReady && (
                <div className={`${styles.urgentQuestContainer}`}>
                    <p className={`${styles.questWarning}`}>⚠ System requires initial calibration</p>
                    <button className={`${styles.btnUrgent}`} onClick={() => navigate('/evaluation')}>
                        Start Evaluation
                    </button>
                </div>
            )}
            {userData.isConfigured && isReady && (
                <StatusWindow />
            )}
            
        </main>
        <Navbar />
        </>
    )
}