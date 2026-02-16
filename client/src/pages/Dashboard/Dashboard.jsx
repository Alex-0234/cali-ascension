
import useUserStore from '../../store/usePlayerStore'
import { useNavigate } from 'react-router';
import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';
import { WorkoutScreen } from './workoutScreen';

export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const hasFetchedInitialData = useUserStore((state) => state.hasFetchedInitialData);
    const logout = useUserStore((state) => state.logout);  

    if (userData.isLoading || !hasFetchedInitialData) {
        return (
            <>
                <h2>[ SYSTEM ]</h2>
                <p>Synchronizing Hunter Data...</p>
            </>
            )
    }

    return (
        <>
        <button onClick={logout}>Logout</button>
        <div className='dashboard'>
            <h2>Dashboard</h2>
            {!userData.isConfigured && (
                <div>
                    <button onClick={() => navigate('/evaluation')}>Start Evaluation</button>
                </div>
            )}
            {userData.isConfigured && (
                <>
                    <StatusWindow />
                    <WorkoutScreen />
                </>
            )}
            
        </div>
        <Navbar />
        </>
    )
}