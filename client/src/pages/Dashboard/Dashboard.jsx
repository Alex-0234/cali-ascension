import useUserStore from '../../store/usePlayerStore'
import useUIStore from '../../store/useUIStore'

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusWindow from './StatusWindow';
import Header from '../../components/layout/header'
import Navbar from '../../components/layout/Navbar';
import EditProfileModal from '../../components/stats/EditProfileModal';
import WorkoutHistoryBlock from '../../components/ui/workoutHistoryBlock';

import styles from '../../styles/dashboard.module.css'


export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const logout = useUserStore((state) => state.logout);  
    const isProfileOpen = useUIStore((state) => state.isProfileOpen);
    const isHistory = useUIStore((state) => state.isHistory);
    const hasFetchedInitialData = useUserStore((state) => state.hasFetchedInitialData);

    const [isReady, setIsReady] = useState(false);
    console.log(isHistory)

    useEffect(() => {
        setIsReady(true);
        
    }, []);

    if (!hasFetchedInitialData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#00e5ff', fontFamily: 'monospace' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 className="blinking-text">[ SYSTEM BOOT SEQUENCE ]</h2>
                    <p>Synchronizing Hunter Data...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        { isProfileOpen && (
            <EditProfileModal />
        )}
        { isHistory.open && isHistory.type === 'exercise' && (
            <WorkoutHistoryBlock />
        )}
{/*         { isHistory.open && isHistory.type === 'weight' && (

        )} */}
        
        <Header logout={logout} />
        <main className={`${styles.dashboard}` }>


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