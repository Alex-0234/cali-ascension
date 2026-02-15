
import useUserStore from '../../store/usePlayerStore'
import { useNavigate } from 'react-router';
import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';
import { WorkoutScreen } from './workoutScreen';

export default function Dashboard() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);
    const logout = useUserStore((state) => state.logout);  

    if (userData.isLoading) {
        return <div className="dashboard">Loading System...</div>;
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