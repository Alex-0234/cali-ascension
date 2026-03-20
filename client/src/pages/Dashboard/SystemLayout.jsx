
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/usePlayerStore';
import useUIStore from '../../store/useUIStore';

import Header from '../../components/layout/header';
import Navbar from '../../components/layout/Navbar';
import WorkoutHistoryBlock from '../../components/ui/workoutHistoryBlock'
import SystemSidebar from '../../components/layout/desktopNavbar';

import { useMediaQuery } from '../../utils/useMediaQuery';

import styles from '../../styles/status.module.css'; 


export default function SystemLayout() {
    const navigate = useNavigate();
    const isDesktop = useMediaQuery('(min-width: 800px)');
    
    const userData = useUserStore((state) => state.userData);
    const logout = useUserStore((state) => state.logout);  
    const hasFetchedInitialData = useUserStore((state) => state.hasFetchedInitialData);
    
    const isHistory = useUIStore((state) => state.isHistory);

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
            {isHistory.open && isHistory.type === 'exercise' && <WorkoutHistoryBlock />}
            
            { !isDesktop && <Header navigate={() => navigate('/settings')} logout={logout} /> }

            <div className={styles.mockBody}> 
                <div className={styles.dashboardWrapper}>

                    <div className={styles.systemWindow}>
                        
                        {isDesktop && <SystemSidebar />}

                        <div className={styles.windowContent}>

                            <Outlet />
                            
                        </div>

                    </div>
                </div>
                {!isDesktop && <Navbar />}
            </div>

            
        </>
    );
}