
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/usePlayerStore';
import useUIStore from '../../store/useUIStore';

import Header from '../../components/layout/header';
import Navbar from '../../components/layout/Navbar';
import EditProfileModal from '../../components/stats/EditProfileModal'
import WorkoutHistoryBlock from '../../components/ui/workoutHistoryBlock'
import SystemSidebar from '../../components/layout/desktopNavbar';

import { useMediaQuery } from '../../utils/useMediaQuery';

import styles from '../../styles/status.module.css'; 

export default function SystemLayout() {
    const isDesktop = useMediaQuery('(min-width: 800px)');
    const navigate = useNavigate();
    
    const userData = useUserStore((state) => state.userData);
    const logout = useUserStore((state) => state.logout);  
    const hasFetchedInitialData = useUserStore((state) => state.hasFetchedInitialData);
    
    const isProfileOpen = useUIStore((state) => state.isProfileOpen);
    const isHistory = useUIStore((state) => state.isHistory);

    const [isReady, setIsReady] = useState(false);

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

    if (!userData.isConfigured && isReady) {
        return (
            <div className="urgentQuestContainer" style={{marginTop: '100px', textAlign: 'center'}}>
                <p className="questWarning">⚠ System requires initial calibration</p>
                <button className="btnUrgent" onClick={() => navigate('/evaluation')}>
                    Start Evaluation
                </button>
            </div>
        );
    }

    return (
        <>
            {isProfileOpen && <EditProfileModal />}
            {isHistory.open && isHistory.type === 'exercise' && <WorkoutHistoryBlock />}
            
            { !isDesktop && <Header logout={logout} /> }

            <div className="mock-body"> 
                <div className={styles.dashboardWrapper}>

                    <div className={styles.systemWindow}>
                        
                        {isDesktop && <SystemSidebar />}

                        <div className={styles.windowContent}>

                            <Outlet />
                            
                        </div>

                    </div>
                </div>
            </div>

            {!isDesktop && <Navbar />}
        </>
    );
}