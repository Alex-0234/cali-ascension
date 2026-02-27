import useUserStore from '../../store/usePlayerStore'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';
import ServerWakeup from './SystemBootScreen';

export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const hasFetchedInitialData = useUserStore((state) => state.hasFetchedInitialData);
    const [isReady, setIsReady] = useState(false);
    const logout = useUserStore((state) => state.logout);  

    useEffect(() => {
        setIsReady(true);

    }, []);

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