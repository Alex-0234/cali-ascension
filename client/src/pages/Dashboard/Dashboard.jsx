import useUserStore from '../../store/usePlayerStore'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';

export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const hasFetchedInitialData = useUserStore((state) => state.hasFetchedInitialData);
    const [isReady, setIsReady] = useState(false);
    const logout = useUserStore((state) => state.logout);  

    useEffect(() => {

        setIsReady(true);

    }, []);

    if (userData.isLoading || !hasFetchedInitialData) {
        return (
            <div className="system-boot">
                <div className="spinner"></div>
                <h2>[ SYSTEM ]</h2>
                <p className="blinking-text">Synchronizing Hunter Data...</p>

                <p>Might take a moment for the server to initialize...</p>
            </div>
        )
    }

    return (
        <>
        <div className='dashboard'>
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button className="btn-logout" onClick={logout}>Logout</button>
            </div>

            {!userData.isConfigured && isReady && (
                <div className="urgent-quest-container">
                    <p className="quest-warning">⚠ System requires initial calibration</p>
                    <button className="btn-urgent" onClick={() => navigate('/evaluation')}>
                        Start Evaluation
                    </button>
                </div>
            )}
            {userData.isConfigured && isReady && (
                <StatusWindow />
            )}
            
        </div>
        <Navbar />
        </>
    )
}