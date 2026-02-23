import useUserStore from '../../store/usePlayerStore'
import { useNavigate } from 'react-router-dom';
import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';

export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const hasFetchedInitialData = useUserStore((state) => state.hasFetchedInitialData);
    const logout = useUserStore((state) => state.logout);  

    // Nastylovaný načítací stav
    if (userData.isLoading || !hasFetchedInitialData) {
        return (
            <div className="system-boot">
                <div className="spinner"></div>
                <h2>[ SYSTEM ]</h2>
                <p className="blinking-text">Synchronizing Hunter Data...</p>
            </div>
        )
    }

    return (
        <>
        <div className='dashboard'>
            {/* Hlavička s nadpisem a odhlášením vedle sebe */}
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button className="btn-logout" onClick={logout}>Logout</button>
            </div>

            {/* Pokud hráč ještě neprošel evaluací (Urgent Quest styl) */}
            {!userData.isConfigured && (
                <div className="urgent-quest-container">
                    <p className="quest-warning">⚠ System requires initial calibration</p>
                    <button className="btn-urgent" onClick={() => navigate('/evaluation')}>
                        Start Evaluation
                    </button>
                </div>
            )}

            {/* Hlavní stavové okno (zobrazí se po evaluaci) */}
            {userData.isConfigured && (
                <StatusWindow />
            )}
            
        </div>
        <Navbar />
        </>
    )
}